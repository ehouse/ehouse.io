import Markdoc, { type Config } from "@markdoc/markdoc";

// Add custom tags here as you need them
export const markdocConfig: Config = {
  nodes: {
    fence: {
      attributes: {
        language: { type: String },
        content: { type: String },
      },
      transform(node) {
        const language = node.attributes.language ?? "";
        const content = node.attributes.content ?? "";
        return new Markdoc.Tag(
          "pre",
          { "data-language": language },
          [new Markdoc.Tag("code", {}, [content])],
        );
      },
    },
  },
  tags: {
    callout: {
      render: "div",
      attributes: {
        type: { type: String, default: "info" },
      },
      transform(node, config) {
        const type = node.attributes.type ?? "info";
        return new Markdoc.Tag(
          "div",
          { class: `post-callout post-callout-${type}` },
          node.transformChildren(config),
        );
      },
    },
    photo: {
      render: "img",
      selfClosing: true,
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
      },
    },
  },
};
