---
version: 1.0.0
name: ReviewLens-design-system
description: "A near-black, software-craft merchant intelligence canvas built around #010102, charcoal panels (#0f1011, #141516), crisp hairlines (#23252a), and high-contrast ink typography (#f7f8f8). Derived from the Linear and Stripe design systems in VoltAgent/awesome-design-md, synthesized with Unslop design principles. Restrained, quiet chrome where color is strictly reserved for meaningful data points: green (#27a644) for positive sentiment, amber (#f59e0b) for rating mismatches and neutral reviews, and coral red (#eb5757) for critical issues requiring merchant action. All numerical metrics are rendered in tabular figures."

colors:
  canvas: "#010102"
  surface-1: "#0f1011"
  surface-2: "#141516"
  surface-3: "#18191a"
  surface-4: "#191a1b"
  hairline: "#23252a"
  hairline-strong: "#34343a"
  hairline-tertiary: "#3e3e44"
  ink: "#f7f8f8"
  ink-muted: "#d0d6e0"
  ink-subtle: "#8a8f98"
  ink-tertiary: "#62666d"
  primary: "#5e6ad2"
  primary-hover: "#828fff"
  primary-focus: "#5e69d1"
  semantic-success: "#27a644"
  semantic-warning: "#f59e0b"
  semantic-danger: "#eb5757"

typography:
  display:
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.5px
  headline:
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.3px
  body:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption:
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.1px
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 11px
    fontWeight: 400
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    height: 56px
    borderBottom: "1px solid {colors.hairline}"
  stat-card:
    backgroundColor: "{colors.surface-1}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 16px
  review-row:
    borderBottom: "1px solid {colors.hairline}"
    hoverBackground: "{colors.surface-2}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    border: "1px solid {colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 6px 12px
