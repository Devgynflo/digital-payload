import {
  BeforeChangeHook,
  AfterChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../payload.types";
import { stripe } from "../../lib/stripe";
import { slugField } from "../fields/slug";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    const userProductsIDs = (user.products || []).reduce<Array<string>>(
      (acc, product) => {
        if (!product) return acc;
        if (typeof product === "string") {
          acc.push(product);
        } else {
          acc.push(product.id);
        }
        return acc;
      },
      [],
    );

    return {
      id: {
        in: userProductsIDs,
      },
    };
  };

const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product,
      ) || []),
    ];

    /* const createdproductIDS = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index,
    ); */

    // @ts-ignore
    const createdproductIDS = [...new Set(allIDs)];

    const dataToUpdate = [...createdproductIDS, doc.id];

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Produit",
    plural: "Produits",
  },
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {
          const data = args.data as Product;
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "EUR",
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated;
        } else if (args.operation === "update") {
          const data = args.data as Product;
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };

          return updated;
        }
      },
    ],
  },
  access: {
    create: ({ req }) => {
      if (req.user.role === "admin") {
        return true;
      }
      return false;
    },
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Nom",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "product_usage",
      type: "textarea",
      label: "Usage/Utilisation du produit",
    },
    {
      name: "composition",
      type: "textarea",
      label: "Composition",
    },
    {
      name: "brands",
      label: "Marque",
      type: "relationship",
      relationTo: "brands",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "range_product",
      label: "Gamme de produit",
      type: "relationship",
      relationTo: "range_products",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "categories",
      label: "Categorie",
      type: "relationship",
      relationTo: "categories",
      required: true,
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    slugField(),
    {
      name: "price",
      label: "Prix",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "pricePro",
      label: "Prix professionnel",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "supplierPrice",
      label: "Prix fournisseur",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "quantity",
      label: "Quantité du produit",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
    },
    {
      name: "capacity",
      label: "Capacité",
      type: "text",
      required: true,
    },
    {
      name: "weight",
      label: "Poids net du produit",
      type: "number",
      required: true,
    },
    {
      name: "isFeatured",
      label: "Produit star ?",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      type: "select",
      defaultValue: "_isFalse",
      options: [
        {
          label: "Oui",
          value: "_isTrue",
        },
        {
          label: "Non",
          value: "_isFalse",
        },
      ],
    },
    {
      name: "outOfStock",
      label: "En stock ?",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      type: "select",
      defaultValue: "_isFalse",
      options: [
        {
          label: "En stock",
          value: "_isFalse",
        },
        {
          label: "Victime de son succès",
          value: "_isTrue",
        },
      ],
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      label: "Image(s) du produit",
      minRows: 1,
      maxRows: 4,
      type: "array",
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
