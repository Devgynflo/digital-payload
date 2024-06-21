import { NextPage } from "next";
import Image from "next/image";

interface ThankYouPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage: NextPage<ThankYouPageProps> = ({ searchParams }) => {
  const { orderId } = searchParams;
  return (
    <main className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden md:block lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
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
            <h1 className="text-sm font-medium text-blue-600">
              Order Successfull
            </h1>

            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks you ordering
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
