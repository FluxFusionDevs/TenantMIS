import LoginForm from '@/components/login-form';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Client Portal</h1>
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-4 text-left text-xs">
          <a href="/forgot-password" className="underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;