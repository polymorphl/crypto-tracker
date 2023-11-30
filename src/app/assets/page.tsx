import { getAssets } from '@/data/assets';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function AssetsPage() {
  const data = await getAssets();

  return (
    <div className="container mx-auto py-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
