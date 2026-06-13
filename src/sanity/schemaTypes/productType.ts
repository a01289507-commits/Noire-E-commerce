import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    // 1. Basic Product Info
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().error('Product name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU (Stock Keeping Unit)',
      type: 'string',
      description: 'Unique identifier for global inventory tracking (e.g., PROD-101)',
    }),

    // 2. Base Pricing & Stock (Agar variants na hon toh ye use hoga)
    defineField({
      name: 'price',
      title: 'Base Price',
      type: 'number',
      description: 'Agar product ke variants hain, toh ye starting price ban jayegi.',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price (Original Price)',
      type: 'number',
      description: 'Original price before discount (e.g., Cut-price display ke liye).',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Base Stock Quantity',
      type: 'number',
      description: 'Total stock agar variants nahi hain.',
      validation: (Rule) => Rule.required().min(0),
      initialValue: 0,
    }),

    // 3. Categories & Status
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Active', value: 'active' },
          { title: 'Out of Stock', value: 'outofstock' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    // Isko fields array ke andar status ke baad add kr dein
defineField({
  name: 'isFeatured',
  title: 'Show on Home Page (Featured Product)',
  type: 'boolean',
  description: 'Agar aap is product ko direct home page pr dikhana chahte hain toh isay ON kr dein.',
  initialValue: false,
}),

    // 4. Media (Main Images)
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required().error('Alt text is good for SEO'),
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Product Gallery',
      type: 'array',
      description: 'General product images or lifestyle shots.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }),
          ],
        }),
      ],
    }),

    // 5. Rich Text Description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      description: 'Product ki details (Isme aap bold, italic, aur lists use kar sakte hain).',
      of: [{ type: 'block' }],
    }),

    // 6. Product Variants (Sizes, Colors, Custom Price per variant)
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      description: 'Agar is product ke multiple colors ya sizes hain toh yahan add karein.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'variant',
          title: 'Variant',
          fields: [
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string', // E.g., 'Black', 'Red'
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string', // E.g., 'S', 'M', 'L'
            }),
            defineField({
              name: 'price',
              title: 'Variant Price',
              type: 'number',
              description: 'Agar is specific variant ki price base price se alag hai (Optional).',
            }),
            defineField({
              name: 'stock',
              title: 'Variant Stock Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'sku',
              title: 'Variant SKU',
              type: 'string', // E.g., TSHIRT-BLK-M
            }),
            defineField({
              name: 'images',
              title: 'Variant Specific Images',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
              description: 'Sirf is variant color ki images.',
            }),
          ],
          // Sanity Studio mein variant ki list ko clean dekhne ke liye preview template
          preview: {
            select: {
              color: 'color',
              size: 'size',
              price: 'price',
              stock: 'stock',
            },
            prepare(selection) {
              const { color, size, price, stock } = selection
              return {
                title: `${color || ''} ${color && size ? '/' : ''} ${size || 'Standard'}`,
                subtitle: `Price: ${price ? price : 'Base Price'} | Stock: ${stock}`,
              }
            },
          },
        }),
      ],
    }),
  ],
})