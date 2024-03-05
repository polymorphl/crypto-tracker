import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { parse } from 'csv-parse';
import { createAssets, getAssetsByTickers } from '@/data/assets';
import { get } from 'http';
import { getProviderBySlug } from '@/data/providers';
import { Provider } from '@/db/schema';
import { createLinks } from '@/data/link';

async function transformRecords(records: any, provider: Provider) {
  const unit = records[0];
  // group all unique 'Asset' values
  const assets = records.reduce((acc: any, record: any) => {
    if (!acc.includes(record['Asset'])) {
      acc.push(record['Asset']);
    }
    return acc;
  }, []);
  // Check for existing assets
  const existingAssets = await getAssetsByTickers(assets);
  const existingAssetsTickers = existingAssets.map((a: any) => a.ticker);

  // Create Assets
  const newAssets = assets.filter(
    (a: any) => !existingAssetsTickers.includes(a)
  );
  // format newAssets
  if (newAssets.length) {
    const newAssetsFormatted = newAssets.map((a: any) => ({
      ticker: a,
      name: a,
      description: a,
      type: 'crypto',
    }));
    const assetsCreated = await createAssets(newAssetsFormatted);
    console.log({ assetsCreated });
  } else {
    const assetsInfo = existingAssets.map((a: any) => {
      return {
        id: a.id,
        ticker: a.ticker,
        name: a.name,
        type: a.type,
      };
    });
    const formattedAssets = records.map((record: any) => {
      return {
        ...record,
        asset_slug: assetsInfo.find((a: any) => a.ticker === record['Asset'])
          .ticker,
        asset_id: assetsInfo.find((a: any) => a.ticker === record['Asset']).id,
        provider_id: provider.id,
      };
    });

    const links = await createLinks(formattedAssets, provider);
    // Create Transactions
    console.log({ links });
    // console.log({ links });
  }
  // console.log({ existingAssets, newAssets });

  // Create Links
  // const links = await createLinks(records, provider);

  // Create Transactions

  return { unit };
}

async function parseFile(filePath: string, provider: string) {
  const content = await readFileSync(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    // CSV-Parser
    const records: any = [];
    // Initialize the parser
    const parser = parse({
      trim: true,
      delimiter: ',',
      skip_empty_lines: true,
      columns: true,
      // skip_records_with_empty_values: true,
      // skip_records_with_error: true,
    });
    // Use the readable stream api to consume records
    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    // Catch any error
    parser.on('error', function (err) {
      console.log({ err });
      return reject(err);
    });
    parser.on('end', function () {
      console.log({ recordsSize: records.length });
      return resolve(records);
    });
    // Write data to the stream
    if (provider === 'coinbase') {
      parser.write(content.split('\n').slice(7).join('\n'));
    } else {
      parser.write(content);
    }
    // Close the readable stream
    parser.end();
  });
}

export async function POST(req: Request, res: Response) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;
  const provider = data.get('provider') as string;
  const remoteProvider = await getProviderBySlug(provider);
  console.log({ provider, remoteProvider });

  if (!file) {
    return Response.json({
      error: 'No file uploaded',
    });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = join('tmp', file.name);
  await writeFileSync(filePath, buffer, 'utf-8');
  console.log('# new file', { name: file.name, filePath });
  // TODO: parse file
  try {
    const records = await parseFile(filePath, provider);
    const transformedRecords = await transformRecords(
      records,
      remoteProvider as Provider
    );
    // const
    console.log({ transformedRecords });
  } catch (err) {
    console.log({ err });
    return Response.json({
      error: 'Error parsing file',
      err,
    });
  }

  return Response.json({ path: filePath });
}
