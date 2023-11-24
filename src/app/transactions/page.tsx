import { getTransactions } from '@/data/transactions';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function TransactionsPage() {
  const data = await getTransactions();
  console.log({ data });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
