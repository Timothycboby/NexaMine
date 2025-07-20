import { SignIn } from "@clerk/clerk-react";

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg rounded-lg",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      />
    </div>
  );
} 