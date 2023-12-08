import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect('/api/auth/login?post_login_redirect_url=/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            Let’s start authenticating <br /> with KindeAuth
          </CardTitle>
          <CardDescription>Configure your app</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="https://kinde.com/docs/sdks/nextjs-sdk"
            target="_blank"
            rel="noreferrer"
            className="btn btn-light btn-big"
          >
            Go to docs
          </Link>
          <Button className="m-2">
            <Link href="/protected">Go to protected</Link>
          </Button>
        </CardContent>
      </Card>
      <CardFooter className="flex flex-col justify-between p-6">
        <Button className="m-2">
          <Link href="/transactions">Go to transactions</Link>
        </Button>

        <Button className="m-2">
          <Link href="/assets">Go to assets</Link>
        </Button>
      </CardFooter>
    </main>
  );
}
