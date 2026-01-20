import { type SchemaTypeDefinition } from 'sanity'
import project from '../schemas/project'
import caseStudy from '../schemas/caseStudy'
import galleryItem from '../schemas/galleryItem'
import twoColumnBlock from '../schemas/twoColumnBlock'
import calloutBlock from '../schemas/calloutBlock'
import videoBlock from '../schemas/videoBlock'
import divider from '../schemas/divider'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, caseStudy, galleryItem, twoColumnBlock, calloutBlock, videoBlock, divider],
}
