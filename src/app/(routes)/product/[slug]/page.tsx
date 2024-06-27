import { AddToCartButton } from "@/components/Product/add-to-cart-button";
import { ImageSlider } from "@/components/Product/image-slider";
import { ProductReel } from "@/components/Product/reel";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { constructMetadata, formatPrice } from "@/lib/utils";
import { getPayloadClient } from "@/payload/get-payload-client";
import { Category } from "@/payload/payload.types";

import { Check, Shield } from "lucide-react";

import { Metadata, NextPage } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductDetailsPageProps {
  params: {
    slug: string;
  };
}

const BREADCRUMBS = [
  {
    id: 1,
    name: "Accueil",
    href: "/",
  },
  {
    id: 2,
    name: "Produits",
    href: "/products",
  },
];

export async function generateMetadata({
  params: { slug },
}: ProductDetailsPageProps): Promise<Metadata> {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  const [product] = products;
  const urls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return constructMetadata({
    title: product.name,
    description: product.description!,
    image: urls[0],
  });
}

const ProductDetailsPage: NextPage<ProductDetailsPageProps> = async ({
  params,
}) => {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      slug: {
        equals: params.slug,
      },
    },
  });

  const [product] = products;

  if (!product) {
    notFound();
  }

  console.log("category", (product.categories[0] as Category).name);

  const urls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center gap-1">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="text-sm font-medium text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-1 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>
                <div className="ml-4 border-l border-gray-300 pl-4 text-muted-foreground">
                  {product.categories &&
                    product.categories.map((item) => {
                      if (typeof item === "object") {
                        return <span key={item.id}>{item.name}</span>;
                      }
                    })}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden
                  className="size-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery.
                </p>
              </div>
            </section>
          </div>

          {/* Product Image */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={urls} />
            </div>
          </div>

          {/* Add to cart  */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div className="">
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="text-medium group inline-flex text-sm">
                  <Shield
                    className="textgray-400 mr-2 size-5 flex-shrink-0"
                    aria-hidden
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      /> */}
    </MaxWidthWrapper>
  );
};

export default ProductDetailsPage;
