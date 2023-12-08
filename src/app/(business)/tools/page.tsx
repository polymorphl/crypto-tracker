import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

import Uploader from '@/components/core/Uploader';

export default async function AssetsPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect('/api/auth/login?post_login_redirect_url=/tools');
  }

  return (
    <div className="container mx-auto py-5">
      <h1>Tools</h1>
      <Uploader />
    </div>
  );
}
