import { adminPasswordLength, adminProblem } from '@/lib/auth';
import LoginForm from './login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="login-card">
      <p className="tag mark">The Stable</p>
      <h1>Sign in</h1>
      <LoginForm problem={adminProblem()} length={adminProblem() === 'short' ? adminPasswordLength() : 0} />
    </main>
  );
}
