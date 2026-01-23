export const NON_WIP_SLUGS = ['data-studio', 'encore', 'catalant']

export function isProjectWip(slug: string): boolean {
  return !NON_WIP_SLUGS.includes(slug)
}
