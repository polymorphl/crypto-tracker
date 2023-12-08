import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { getAssets } from '@/data/assets';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function AssetsPage() {
  const data = await getAssets();
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect('/api/auth/login?post_login_redirect_url=/assets');
  }

  return (
    <div className="container mx-auto py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
