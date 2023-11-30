import { getAssetByTicker } from '@/data/assets';
import { getTransactionsByTicker } from '@/data/transactions';
import { columns } from '@/app/transactions/columns';
import { DataTable } from '@/app/transactions/data-table';
import AssetCard from '@/components/core/AssetCard';

export default async function AssetPage({
  params,
}: {
  params: { ticker: string };
}) {
  let page = 0;
  const assetData = await getAssetByTicker(params.ticker as string);
  if (!assetData) {
    return <div>Asset not found</div>;
  }

  const { data, count, total_amount } = await getTransactionsByTicker({
    page,
    ticker: params.ticker,
  });

  return (
    <div className="container mx-auto py-5">
      <AssetCard data={assetData} price={37000} total={total_amount} />
      <DataTable
        columns={columns}
        data={data}
        count={count}
        visibleColumns={{ asset: false }}
      />
    </div>
  );
}
