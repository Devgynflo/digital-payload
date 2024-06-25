import type { Field } from "payload/types";

import deepMerge from "../utilities/deepMerge";
import formatSlug from "../utilities/formatSlug";

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field;

export const slugField: Slug = (fieldToUse = "name", overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: "slug",
      label: "Slug",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        hidden: true,
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  );
