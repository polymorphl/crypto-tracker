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
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Testing auth</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {session ? `Signed in as ${session?.user?.email}` : 'Not signed in'}
          </CardDescription>
          {!session?.user ? (
            <>
              <Button className="m-2">
                <Link href="/sign-up">Sign up</Link>
              </Button>
              <Button className="m-2">
                <Link href="/login">Login</Link>
              </Button>
            </>
          ) : null}
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
