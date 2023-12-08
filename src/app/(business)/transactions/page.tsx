import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import { getTransactions } from '@/data/transactions';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function TransactionsPage() {
  const { data, count } = await getTransactions();
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect('/api/auth/login?post_login_redirect_url=/transactions');
  }

  return (
    <div className="container mx-auto py-5">
      <DataTable columns={columns} data={data} count={count} />
    </div>
  );
}
