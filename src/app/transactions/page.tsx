import { getTransactions } from '@/data/transactions';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function TransactionsPage() {
  const { data, count } = await getTransactions();

  return (
    <div className="container mx-auto py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
