import { NextPage } from "next";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import Link from "next/link";
import { Icons } from "../icons";
import { NavItems } from "./Items";
import { buttonVariants } from "../ui/button";
import { Cart } from "@/components/Navbar/Cart";
import { getServerSideUser } from "@/lib/payload.utils";
import { cookies } from "next/headers";
import { UserAccountNav } from "./UserAccountNav";

interface NavbarProps {}

export const Navbar: NextPage<NavbarProps> = async ({}) => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <header className="sticky inset-0 top-0 z-50 h-16 bg-white">
      <div className="relative bg-white">
        <MaxWidthWrapper>
          <nav className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* MOBILE */}

              <div className="ml-4 flex lg:ml-0">
                <Link href={"/"}>
                  <Icons.logo className="size-10" />
                </Link>
              </div>

              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {!user && (
                    <Link
                      href={"/sign-in"}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Connexion
                    </Link>
                  )}
                  <span className="size-6 w-px bg-gray-200" aria-hidden />

                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <>
                      <Link
                        href={"/sign-up"}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        Créer un compte
                      </Link>
                      <span className="size-6 w-px bg-gray-200" aria-hidden />
                    </>
                  )}
                </div>
                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </nav>
        </MaxWidthWrapper>
      </div>
    </header>
  );
};
