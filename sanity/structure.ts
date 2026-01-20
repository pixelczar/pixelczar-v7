import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { DocumentIcon, CaseIcon, ImagesIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Projects with drag & drop ordering
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        icon: DocumentIcon,
        S,
        context,
      }),
      // Case Studies with drag & drop ordering
      orderableDocumentListDeskItem({
        type: 'caseStudy',
        title: 'Showcases',
        icon: CaseIcon,
        S,
        context,
      }),
      // Gallery Items with drag & drop ordering
      orderableDocumentListDeskItem({
        type: 'galleryItem',
        title: 'Gallery',
        icon: ImagesIcon,
        S,
        context,
      }),
    ])
