import { redirect } from 'next/navigation';

import { AssetDto, getAssetByTicker } from '@/data/assets';
import { TransactionDto, getTransactionsByTicker } from '@/data/transactions';
import { columns } from '@/app/(business)/transactions/columns';
import { DataTable } from '@/app/(business)/transactions/data-table';
import AssetCard from '@/components/core/AssetCard';
import { Asset } from '@/db/schema';

export default async function AssetPage({
  params,
}: {
  params: { ticker: string };
}) {
  let page = 0;
  const linkData = await getAssetByTicker(params.ticker as string, page);

  // TODO: Implement error page
  if (!linkData) {
    return <div>linkData not found</div>;
  }

  const { data, count, total_amount } = await getTransactionsByTicker({
    page,
    ticker: params.ticker,
  });

  return (
    <div className="container mx-auto py-5">
      <AssetCard
        data={linkData as AssetDto}
        price={37040}
        total={total_amount}
      />
      <DataTable
        columns={columns}
        data={data}
        count={+count}
        visibleColumns={{ asset: false }}
      />
    </div>
  );
}
