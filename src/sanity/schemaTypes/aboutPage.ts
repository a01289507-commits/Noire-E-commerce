import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Our Story',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
      description: 'Elegant brand philosophy statement.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'brandStory',
      title: 'The Brand Story',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'founderQuote',
      title: 'Founder Quote',
      type: 'object',
      fields: [
        defineField({ name: 'quote', type: 'text', title: 'Quote' }),
        defineField({ name: 'author', type: 'string', title: 'Author Name' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Brand Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          ],
        },
      ],
      options: { layout: 'grid' },
    }),
  ],
})