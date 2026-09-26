import type { ColorPalettePreviewContext, ColorPaletteTokenKey } from "@/lib/appearance/color-palette-groups";

type ColorTokenPreviewProps = {
  token: ColorPaletteTokenKey;
  color: string;
  context: ColorPalettePreviewContext;
};

export function ColorTokenPreview({ token, color, context }: ColorTokenPreviewProps) {
  switch (token) {
    case "primary":
      return (
        <span className="appearance-color-preview__button" style={{ background: color, color: "#fff" }}>
          Save
        </span>
      );
    case "primaryDark":
      return (
        <span className="appearance-color-preview__button" style={{ background: color, color: "#fff" }}>
          Save (hover)
        </span>
      );
    case "secondary":
      return (
        <span className="appearance-color-preview__tag" style={{ color, borderColor: color }}>
          Label
        </span>
      );
    case "accent":
      return (
        <span className="appearance-color-preview__badge" style={{ background: color, color: "#fff" }}>
          New
        </span>
      );
    case "background":
      return (
        <div className="appearance-color-preview__page" style={{ background: color }}>
          <span style={{ color: context.text }}>Page background</span>
        </div>
      );
    case "surface":
      return (
        <div className="appearance-color-preview__stack" style={{ background: context.background }}>
          <div className="appearance-color-preview__panel" style={{ background: color, borderColor: context.border }}>
            <span style={{ color: context.text }}>Section panel</span>
          </div>
        </div>
      );
    case "card":
      return (
        <div className="appearance-color-preview__stack" style={{ background: context.surface }}>
          <div className="appearance-color-preview__card" style={{ background: color, borderColor: context.border }}>
            <strong style={{ color: context.text }}>Card title</strong>
            <span style={{ color: context.muted }}>Card content</span>
          </div>
        </div>
      );
    case "text":
      return (
        <div className="appearance-color-preview__copy" style={{ background: context.background }}>
          <strong style={{ color }}>Page heading</strong>
          <span style={{ color }}>Body paragraph text</span>
        </div>
      );
    case "muted":
      return (
        <div className="appearance-color-preview__copy" style={{ background: context.background }}>
          <span style={{ color: context.text }}>Field label</span>
          <span style={{ color }}>Helper text under inputs</span>
        </div>
      );
    case "border":
      return (
        <div
          className="appearance-color-preview__input"
          style={{ background: context.background, borderColor: color, color: context.text }}
        >
          Input border
        </div>
      );
    case "sidebar":
      return (
        <div className="appearance-color-preview__sidebar" style={{ background: color }}>
          <span className="is-active">Dashboard</span>
          <span>Themes</span>
          <span>Products</span>
        </div>
      );
    case "header":
      return (
        <div className="appearance-color-preview__header" style={{ background: color, borderColor: context.border }}>
          <span style={{ color: context.text }}>Admin header</span>
          <span className="appearance-color-preview__avatar" style={{ background: context.muted }} />
        </div>
      );
    case "success":
      return (
        <span className="appearance-color-preview__alert is-success" style={{ background: color, color: "#fff" }}>
          Saved successfully
        </span>
      );
    case "warning":
      return (
        <span className="appearance-color-preview__alert is-warning" style={{ background: color, color: "#fff" }}>
          Review required
        </span>
      );
    case "error":
      return (
        <span className="appearance-color-preview__alert is-error" style={{ background: color, color: "#fff" }}>
          Something failed
        </span>
      );
    case "info":
      return (
        <span className="appearance-color-preview__alert is-info" style={{ background: color, color: "#fff" }}>
          Information notice
        </span>
      );
    default:
      return null;
  }
}
