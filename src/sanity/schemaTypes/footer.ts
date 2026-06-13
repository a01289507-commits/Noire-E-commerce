import { EarthGlobeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const footerType = defineType({
  name: 'footer',
  title: 'Footer Settings',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'NOIRÉ',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Description',
      type: 'text',
      description: 'Short intro or tagline for the footer.',
    }),
    defineField({
      name: 'links',
      title: 'Useful Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Link Title' },
            { name: 'url', type: 'string', title: 'URL Path' },
          ],
        },
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      initialValue: '© 2026 NOIRÉ. All rights reserved.',
    }),
  ],
})