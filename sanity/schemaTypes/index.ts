import { type SchemaTypeDefinition } from 'sanity'
import project from '../schemas/project'
import caseStudy from '../schemas/caseStudy'
import galleryItem from '../schemas/galleryItem'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, caseStudy, galleryItem],
}
