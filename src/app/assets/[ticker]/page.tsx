import { getAssetByTicker } from '@/data/assets';
import { getTransactionsByTicker } from '@/data/transactions';
import { columns } from '@/app/transactions/columns';
import { DataTable } from '@/app/transactions/data-table';
export default async function AssetPage({
  params,
}: {
  params: { ticker: string };
}) {
  let page = 0;
  const assetData = await getAssetByTicker(params.ticker as string);
  const { data, count } = await getTransactionsByTicker({
    page,
    ticker: params.ticker,
  });

  // console.log({ data });

  return (
    <div className="container mx-auto py-10">
      <pre>{JSON.stringify(assetData, null, 2)}</pre>
      <DataTable
        columns={columns}
        data={data}
        count={count}
        visibleColumns={{ asset: false }}
      />
    </div>
  );
}
