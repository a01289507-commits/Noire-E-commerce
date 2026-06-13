import { defineField, defineType } from 'sanity'

export const heroType = defineType({
  name: 'heroBanner',
  title: 'Hero Banner Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'slides',
      title: 'Hero Slides',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'heading', type: 'string', title: 'Heading' },
          { name: 'subHeading', type: 'text', title: 'Sub-Heading' }, // 'text' use karein taaki lambi description aa sake
          { 
            name: 'bannerImage', 
            type: 'image', 
            title: 'Banner Image', 
            options: { hotspot: true } 
          },
          { 
            name: 'theme', 
            type: 'string', 
            title: 'Theme Color', 
            options: { list: ['dark', 'light'] },
            description: 'Agar image dark hai to "light" select karein, warna "dark".'
          },
          { name: 'buttonText', type: 'string', title: 'Button Text' },
          { name: 'buttonUrl', type: 'string', title: 'Button URL' },
        ]
      }]
    }),
  ],
})