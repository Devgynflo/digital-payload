import { PaymentStatus } from "@/components/payment-status";
import { getServerSideUser } from "@/lib/payload.utils";
import { formatPrice } from "@/lib/utils";
import { getPayloadClient } from "@/payload/get-payload-client";
import { Product } from "@/payload/payload.types";
import { NextPage } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
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

  //const fee = order.user.isNearby ? 0 : 4.5;
  const paymentMethod = "Visa";

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (orderUserId !== user?.id || !user.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  return (
    <div className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          priority
          sizes="100%"
          src={"/swabell-logo.jpg"}
          alt="thank-you"
          fill
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-16 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Merci pour votre commande
            </h1>
            {order.is_paid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Nous vous remercions de votre commande. Nous vous tiendrons
                informé par e-mail lorsque les articles de votre commande auront
                été expédiés.
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                Votre commande est en attente de paiement. Nous vous tiendrons
                informé par e-mail lors de l&poas;évolution de cette dernière.
              </p>
            )}

            <div className="mt-8 text-sm font-medium">
              <div className="text-muted-foreground">
                Commande n°:
                <span className="ml-2 text-gray-900 underline">{order.id}</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {order.is_paid && (
                <p>Moyen de paiement sélectionné : {paymentMethod}</p>
              )}
            </div>

            <PaymentStatus
              isPaid={order.is_paid}
              orderEmail={user.email}
              orderId={order.id}
            />

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const { image } = product.images[0];
                return (
                  <li key={product.id} className="flex space-x-6 py-6">
                    <div className="relative size-24">
                      {typeof image !== "string" && image.url && (
                        <Image
                          priority
                          sizes="100%"
                          className="flex-none rounded-md bg-gray-100 object-cover object-center"
                          src={image.url}
                          alt={`Illustration ${product.name}`}
                          fill
                        />
                      )}
                    </div>

                    <div className="flex flex-auto flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">{product.name}</h3>

                        {
                          <p className="my-1">
                            Quantité:
                            {
                              order.items?.find(
                                ({ product: p }) =>
                                  (p as Product).id === product.id,
                              )?.quantity
                            }
                          </p>
                        }
                      </div>
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-8 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Montant total de la commande:</p>
                <p className="text-gray-900">{formatPrice(order.total)}</p>
              </div>

              <div className="flex justify-between">
                <p>Frais de port :</p>
                <p className="text-gray-900">{formatPrice(1)}</p>
              </div>
            </div>

            <div className="text-gray flex items-center justify-between border-t border-gray-200 pt-6">
              <p className="text-base">Total :</p>
              <p className="text-base">{formatPrice(order.total + 1)}</p>
            </div>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                href={"/"}
                className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                Continuez vos achats &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;

/* 

 /* return (
    <main className="relative lg:max-h-full">
      <div className="absolute hidden h-80 overflow-hidden lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          priority
          sizes="100%"
          src="/swabell-logo.jpg"
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
                const label = (product.categories[0] as Category).name;

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

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-gray-900">{formatPrice(1)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
              <p className="text-base">Total</p>
              <p className="text-base">{formatPrice(orderTotal + 1)}</p>
            </div>
          </div>

          <PaymentStatus
            orderId={order.id}
            isPaid={order.is_paid}
            orderEmail={user.email}
          />

          <div className="mt-16 border-t border-gray-200 py-6 text-right">
            <Link
              href={"/products"}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Continue Shopping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  ); 
}
*/
