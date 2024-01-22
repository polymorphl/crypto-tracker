import { redirect } from 'next/navigation';

import { getAssetByTicker } from '@/data/assets';
import { getTransactionsByTicker } from '@/data/transactions';
import { columns } from '@/app/(business)/transactions/columns';
import { DataTable } from '@/app/(business)/transactions/data-table';
import AssetCard from '@/components/core/AssetCard';

export default async function AssetPage({
  params,
}: {
  params: { ticker: string };
}) {
  // if (!(await isAuthenticated())) {
  //   redirect(
  //     `/api/auth/login?post_login_redirect_url=/assets/${params.ticker}`
  //   );
  // }

  const assetData = await getAssetByTicker(params.ticker as string);

  // TODO: Implement error page
  if (!assetData) {
    return <div>Asset not found</div>;
  }

  let page = 0;
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
