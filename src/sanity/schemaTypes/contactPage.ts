import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Us Page',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Get In Touch',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short intro text for the contact page.',
    }),
    defineField({
      name: 'email',
      title: 'Support Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform (e.g. Instagram)' },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
  ],
})