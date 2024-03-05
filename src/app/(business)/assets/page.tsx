import { getAssets } from '@/data/assets';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Asset } from '@/db/schema';

export default async function AssetsPage() {
  const data = await getAssets({ page: 0 });

  // if (!(await isAuthenticated())) {
  //   redirect('/api/auth/login?post_login_redirect_url=/assets');
  // }

  return (
    <div className="container mx-auto py-5">
      {data.length === 0 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold">No assets found</h1>
          <p className="text-gray-500">
            You can add assets by clicking the button below
          </p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Asset
          </button>
        </div>
      )}
      {data.length > 0 && <DataTable columns={columns} data={data} />}
    </div>
  );
}
