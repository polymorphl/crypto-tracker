import { columns } from '@/app/transactions/columns';
import { DataTable } from '@/app/transactions/data-table';
import { getProviderBySlug } from '@/data/providers';
import { getTransactionsByProvider } from '@/data/transactions';

export default async function ProviderPage({
  params,
}: {
  params: { slug: string };
}) {
  let page = 0;
  const providerData = await getProviderBySlug(params.slug as string);
  const { data, count } = await getTransactionsByProvider({
    page,
    slug: params.slug,
  });

  return (
    <div className="container mx-auto py-10">
      <pre>{JSON.stringify(providerData, null, 2)}</pre>
      <DataTable
        columns={columns}
        data={data}
        count={count}
        visibleColumns={{ provider: false }}
      />
    </div>
  );
}
