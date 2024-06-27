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
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

interface SignUpPageProps {}

const SignUpPage: NextPage<SignUpPageProps> = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("Cette email est peut-être déjà utilisé. Connectez-vous");
        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      return toast.error("Quelque chose s'est mal passé.Réessayez");
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(
        `Un mail de vérification vous a été envoyé! (${sentToEmail})`,
      );
      return router.push(`/verify-email?to=${sentToEmail}`);
    },
  });

  function onSubmit({ email, password }: TAuthCredentialsValidator) {
    mutate({ email, password });
  }
  return (
    <>
      <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="size-20" />
            <h1 className="text-2xl font-bold">Créer un compte</h1>

            <Link
              href={"/sign-in"}
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Déjà un compte ?
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
                  <Label htmlFor="email">Password</Label>
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

                <Button disabled={isLoading}>Créez votre compte</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
