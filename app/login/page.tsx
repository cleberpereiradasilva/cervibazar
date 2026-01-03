import LoginForm from "./LoginForm";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light px-4 dark:bg-background-dark">
      <div className="w-full max-w-md py-12">
        <LoginForm />
      </div>
    </div>
  );
}
