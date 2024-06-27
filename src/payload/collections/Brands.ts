import { CollectionConfig } from "payload/types";
import { slugField } from "../fields/slug";

export const Brands: CollectionConfig = {
  slug: "brands",
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
      label: "Nom de la marque",
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
      label: "Image de la marque",
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
