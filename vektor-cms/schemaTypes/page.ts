// schemaTypes/page.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Identifiant de la page',
      type: 'string',
      description: 'ex: home, ugc, influence, social-media, contact',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Titre principal',
      type: 'string'
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true }
    })
  ],
  preview: {
    select: { title: 'slug', media: 'image' }
  }
})