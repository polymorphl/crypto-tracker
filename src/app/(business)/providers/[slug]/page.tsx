import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { columns } from '@/app/(business)/transactions/columns';
import { DataTable } from '@/app/(business)/transactions/data-table';
import { getProviderBySlug } from '@/data/providers';
import { getTransactionsByProvider } from '@/data/transactions';
import ProviderCard from '@/components/core/ProviderCard';

export default async function ProviderPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect(
      `/api/auth/login?post_login_redirect_url=/providers/${params.slug}`
    );
  }
  // TODO: Implement pagination
  let page = 0;
  const providerData = await getProviderBySlug(params.slug as string);
  const { data, count } = await getTransactionsByProvider({
    page,
    slug: params.slug,
  });

  // TODO: Implement error page
  if (!providerData) {
    return <div className="container mx-auto py-5">Provider not found</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <ProviderCard data={providerData} />
      <DataTable
        columns={columns}
        data={data}
        count={count}
        visibleColumns={{ provider: false }}
      />
    </div>
  );
}
