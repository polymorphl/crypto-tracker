import { Card } from '@/components/ui/card';
import {
  getKindeServerSession,
  RegisterLink,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    redirect('/dashboard');
  }

  return (
    <>
      <Card>
        <LoginLink>Sign in</LoginLink>

        <RegisterLink>Sign up</RegisterLink>
      </Card>
    </>
  );
}
