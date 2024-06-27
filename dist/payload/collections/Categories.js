"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
var slug_1 = require("../fields/slug");
exports.Categories = {
    slug: "categories",
    admin: {
        useAsTitle: "name",
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
        defaultColumns: ["name"],
    },
    hooks: {},
    access: {
        read: function () { return true; },
        create: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    fields: [
        {
            name: "name",
            label: "Titre de la catégorie",
            type: "text",
            required: true,
        },
        {
            name: "description",
            type: "textarea",
            label: "Description",
        },
        (0, slug_1.slugField)(),
        {
            name: "images",
            label: "Image de la catégorie",
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
