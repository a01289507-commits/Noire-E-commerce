export const cartType = {
  name: "cart",
  title: "Cart",
  type: "document",
  fields: [
    {
      name: "productId",
      title: "Product ID",
      type: "string",
    },
    {
      name: "name",
      title: "Product Name",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
      name: "size",
      title: "Size",
      type: "string",
    },
    {
      name: "quantity",   // ✅ naya
      title: "Quantity",
      type: "number",
    },
    {
      name: "image",      // ✅ naya
      title: "Product Image URL",
      type: "string",
    },
    {
      name: "token",
      title: "User Token",
      type: "string",
    },
  ],
};