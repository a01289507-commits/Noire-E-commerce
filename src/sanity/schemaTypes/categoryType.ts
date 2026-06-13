import { FilterIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  icon: FilterIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (Rule) => Rule.required().error('Category title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text', // Plain text paragraph ke liye 'text' best hai
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      description: 'Website ke homepage ya navigation bar par dikhane ke liye.',
      options: {
        hotspot: true, // Image crop/focus karne ke liye
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required().error('Alt text is important for SEO'),
        }),
      ],
    }),
    
    // 👇 YEH VALI FIELD ADD KAREIN (Self-Reference for Sub-categories)
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Agar yeh koi sub-category hai (jaise Shoes), toh iska main parent select karein (e.g., Men ya Women). Main categories ke liye isse khali chorr dein.',
    }),
  ],
})