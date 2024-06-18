import { VerifyEmail } from "@/components/Auth/verify-email";
import { NextPage } from "next";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage: NextPage<VerifyEmailPageProps> = ({ searchParams }) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"></div>
      {token && typeof token === "string" ? (
        <div className="grid gap-6">
          <VerifyEmail token={token} />
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-1">
          <div className="relative mb-4 size-60 text-muted-foreground">
            <Image
              src={"/hippo-email-sent.png"}
              alt="hippo email sent image"
              fill
            />
          </div>

          <h3 className="text-2xl font-semibold">Check your email</h3>
          {toEmail ? (
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a verification email to{" "}
              <span className="font-semibold">{toEmail}</span>.
            </p>
          ) : (
            <p className="text-center text-muted-foreground">
              We&apos; ve sent a verification link to your email.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
