import { defineField, defineType } from 'sanity'

export const headerType = defineType({
  name: 'header',
  title: 'Header Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'topBarText',
      title: 'Top Bar Announcement Text',
      type: 'string',
    }),
    defineField({
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'string', // e.g., "Women"
            }),
            defineField({
              name: 'url',
              title: 'Redirect URL',
              type: 'string', // e.g., "/collections/women"
            }),
            
            // --- YEH NAYA FIELD ADD KIYA HAI ---
            defineField({
              name: 'dropdownLinks',
              title: 'Dropdown Sub-Links',
              type: 'array',
              description: 'Is link par hover karne par jo niche products ya sub-items dikhane hain, unhein add karein',
              of: [
                {
                  type: 'object',
                  name: 'subLink',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Sub-Link Label',
                      type: 'string', // e.g., "Product 1", "New In", "Dresses"
                    }),
                    defineField({
                      name: 'url',
                      title: 'Sub-Link URL',
                      type: 'string', // e.g., "/products/product-1"
                    }),
                  ],
                },
              ],
            }),
            // ----------------------------------
            
          ],
        },
      ],
    }),
  ],
})