import type { FieldHook } from "payload/types";

const format = (val: string): string =>
  val
    .replace(/[éèêë]/g, "e") // Remplace les 'e' avec accent par 'e'
    .replace(/ /g, "-") // Remplace les espaces par des tirets
    .replace(/[^\w-]+/g, "") // Supprime les caractères non alphanumériques ou tirets
    .toLowerCase();

const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === "string") {
      return format(value);
    }

    if (operation === "create") {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback];

      if (fallbackData && typeof fallbackData === "string") {
        return format(fallbackData);
      }
    }

    return value;
  };

export default formatSlug;
