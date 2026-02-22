/**
 * Design tokens - single source of truth for colors matching CSS variables.
 * These map to --primary and --secondary-accent in index.css.
 */
export const DESIGN_TOKENS = {
  /** Primary brand color - matches rgb(var(--primary)) */
  primaryHex: '#26C6FF',
  /** Secondary accent / success - matches rgb(var(--secondary-accent)) */
  secondaryAccentHex: '#00FF66',
} as const
