"use client";

import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface SignInPageProps {}

const SignInPage: NextPage<SignInPageProps> = ({}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Signed in successfully");

      if (origin) {
        router.push(`${origin}`);
        router.refresh();

        return;
      }
      router.push("/");
      router.refresh();

      return;
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password");
      }
    },
  });

  function onSubmit({ email, password }: TAuthCredentialsValidator) {
    signIn({ email, password });
  }

  function continueAsSeller() {
    router.push("?as=seller");
  }

  function continueAsCustomer() {
    router.push("/", undefined);
  }

  return (
    <>
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="size-20" />
            <h1 className="text-2xl font-bold">Connectez-vous</h1>

            <Link
              href={"/sign-up"}
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Aucun compte ? Creéz en un
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {/* Form */}
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="email@exemple.com"
                    className={cn(errors.email && "focus-visible:ring-red-500")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Mot de passe</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="********"
                    className={cn(
                      errors.password && "focus-visible:ring-red-500",
                    )}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button disabled={isLoading}>Connection</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
