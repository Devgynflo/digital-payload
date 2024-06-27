import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Commande",
    plural: "Commandes",
  },
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on DigitalHippo",
  },
  access: {
    create: ({ req }) => req.user.role === "admin",
    read: yourOwn,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "is_paid",
      type: "checkbox",
      access: {
        create: () => false,
        read: ({ req }) => req.user.role === "admin",
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      required: true,
    },
  ],
};
