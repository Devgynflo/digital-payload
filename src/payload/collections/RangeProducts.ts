import { CollectionConfig } from "payload/types";
import { slugField } from "../fields/slug";

export const RangeProducts: CollectionConfig = {
  slug: "range_products",
  labels: {
    singular: "Gamme de produit",
    plural: "Gammes de produits",
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["name"],
  },
  hooks: {},
  access: {
    read: () => true,
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "name",
      label: "Gamme de produit",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    slugField(),
    {
      name: "images",
      label: "Image de la gamme de produit",
      minRows: 1,
      maxRows: 1,
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
