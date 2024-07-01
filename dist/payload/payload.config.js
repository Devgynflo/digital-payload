"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var config_1 = require("payload/config");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var path_1 = __importDefault(require("path"));
var Users_1 = require("./collections/Users");
var dotenv_1 = __importDefault(require("dotenv"));
// Collection
var Products_1 = require("./collections/Products");
var Media_1 = require("./collections/Media");
var Categories_1 = require("./collections/Categories");
var Orders_1 = require("./collections/Orders");
var Brands_1 = require("./collections/Brands");
var RangeProducts_1 = require("./collections/RangeProducts");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../../.env"),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [
        Products_1.Products,
        Categories_1.Categories,
        Brands_1.Brands,
        RangeProducts_1.RangeProducts,
        Media_1.Media,
        Orders_1.Orders,
        Users_1.Users,
    ],
    routes: {
        admin: "/dashboard", // endpoint pour la partie admin
    },
    admin: {
        user: "users", // issue => throw new DuplicateCollection('slug', duplicateSlugs)
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- DigitalHippo",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    rateLimit: {
        max: 2000, // 500
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.DATABASE_URI,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload.types.ts"),
    },
});
