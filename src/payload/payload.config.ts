import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { buildConfig } from "payload/config";

import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import path from "path";
import { Users } from "./collections/Users";

import dotenv from "dotenv";
// Collection
import { Products } from "./collections/Products";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Orders } from "./collections/Orders";
import { Brands } from "./collections/Brands";
import { RangeProducts } from "./collections/RangeProducts";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [
    Products,
    Categories,
    Brands,
    RangeProducts,
    Media,
    Orders,
    Users,
  ],
  routes: {
    admin: "/dashboard", // endpoint pour la partie admin
  },
  admin: {
    user: "users", // issue => throw new DuplicateCollection('slug', duplicateSlugs)
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- DigitalHippo",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  rateLimit: {
    max: 2000, // 500
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload.types.ts"),
  },
});
