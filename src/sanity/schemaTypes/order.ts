import { BasketIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',
  icon: BasketIcon,
  fields: [
    // 1. Order Identification
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique order identifier (e.g., ORD-2026-X892)',
    }),

    // 2. Customer Information
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().regex(
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        { name: 'email', invert: false }
      ).error('Valid email address is required'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 3. Ordered Items (Cart Products)
    defineField({
      name: 'products',
      title: 'Ordered Products',
      type: 'array',
      validation: (Rule) => Rule.required().min(1).error('Order must contain at least one item'),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'orderItem',
          title: 'Order Item',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }], // Humara pehle banaya hua product schema
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'variantTitle',
              title: 'Variant (Size/Color)',
              type: 'string',
              description: 'E.g., "Red / XL" agar customer ne variant select kiya tha.',
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'price',
              title: 'Price at Purchase',
              type: 'number',
              description: 'Jis qeemat par product kharida gaya.',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          // Sanity Studio mein items ki list ko saaf dekhne ke liye preview
          preview: {
            select: {
              title: 'product.name',
              quantity: 'quantity',
              variant: 'variantTitle',
              price: 'price',
              media: 'product.mainImage',
            },
           prepare(selection) {
              const { title, quantity, variant, price, media } = selection
               return {  title: `${title || 'Unknown Product'} ${variant ? `(${variant})` : ''}`,  subtitle: `Qty: ${quantity} x $${price} = $${quantity * price}`,media: media,
                 }
          },
          },
        }),
      ],
    }),

    // 4. Financial Details
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Cash on Delivery (COD)', value: 'cod' },
          { title: 'Credit/Debit Card', value: 'card' },
          { title: 'EasyPaisa / JazzCash', value: 'mobile_wallet' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 5. Order & Delivery Status
    defineField({
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending (New Order)', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],

  // Studio mein poore order ka preview set karne ke liye
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customerName',
      totalAmount: 'totalAmount',
      status: 'status',
    },
    prepare(selection) {
      const { orderNumber, customerName, totalAmount, status } = selection
      const statusLabels: Record<string, string> = {
        pending: '⏳ Pending',
        processing: '⚙️ Processing',
        shipped: '🚚 Shipped',
        delivered: '✅ Delivered',
        cancelled: '❌ Cancelled',
      }
      return {
        title: `${orderNumber} - ${customerName}`,
        subtitle: `Total: $${totalAmount} | Status: ${statusLabels[status] || status}`,
      }
    },
  },
})