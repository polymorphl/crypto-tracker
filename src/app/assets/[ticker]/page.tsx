import { getAssetByTicker } from '@/data/assets';

export default async function AssetPage({
  params,
}: {
  params: { ticker: string };
}) {
  const data = await getAssetByTicker(params.ticker as string);
  console.log({ data });

  return (
    <div className="container mx-auto py-10">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
