import { PRODUCT_CATEGORIES } from "@/config";
import { getServerSideUser } from "@/lib/payload.utils";
import { formatPrice } from "@/lib/utils";
import { getPayloadClient } from "@/payload/get-payload-client";
import { Product, ProductFile } from "@/payload/payload.types";
import { Check } from "lucide-react";
import { NextPage } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

interface ThankYouPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage: NextPage<ThankYouPageProps> = async ({ searchParams }) => {
  const { orderId } = searchParams;

  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  const payload = await getPayloadClient();
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        in: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) return notFound();

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          priority
          sizes="100%"
          src="/checkout-thank-you.jpg"
          alt="thank-you"
          className="size-full object-cover object-center"
          fill
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-blue-600">
              Order Successful
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks you ordering
            </h1>

            {order.is_paid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order was processed and your assets are available to
                download below.We&apos;ve sent your receipt and order details to{" "}
                {typeof order.user !== "string" && (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                )}
              </p>
            ) : (
              <>
                <p className="mt-2 to-muted-foreground text-base">
                  We appreciate your order, and we&apos;re currently processing
                  it.So hang tight and we&apos; ll send you confirmation very
                  soon!
                </p>
              </>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>
            </div>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === product.category,
                )?.label;

                const downloadUrl = (product.product_files as ProductFile)
                  .url as string;

                const { image } = product.images[0];

                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative size-24">
                      {typeof image !== "string" && image.url && (
                        <Image
                          src={image.url}
                          alt={product.name}
                          fill
                          priority
                          sizes="100%"
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="flex flex-auto flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.name}</h3>

                        <p className="my-1">Category: {label}</p>
                      </div>
                    </div>

                    {order.is_paid && (
                      <a
                        href={downloadUrl}
                        download={product.name}
                        className="text-blue-600 underline-offset-2 hover:underline"
                      >
                        Download asset
                      </a>
                    )}

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
