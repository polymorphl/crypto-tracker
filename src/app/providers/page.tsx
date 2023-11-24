import { getProviders } from '@/data/providers';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function AssetsPage() {
  const data = await getProviders();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
