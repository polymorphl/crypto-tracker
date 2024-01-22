import { redirect } from 'next/navigation';

import { getProviders } from '@/data/providers';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function AssetsPage() {
  const data = await getProviders();

  // if (!(await isAuthenticated())) {
  //   redirect('/api/auth/login?post_login_redirect_url=/providers');
  // }

  return (
    <div className="container mx-auto py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
