import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>ToDo</h1>
      <Button>
        <Link href="/transactions">Go to transactions</Link>
      </Button>
      <Button>
        <Link href="/assets">Go to assets</Link>
      </Button>
    </main>
  );
}
