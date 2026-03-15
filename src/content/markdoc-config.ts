import Markdoc, { type Config } from "@markdoc/markdoc";

// Add custom tags here as you need them
export const markdocConfig: Config = {
  tags: {
    callout: {
      render: "div",
      attributes: {},
      transform(node, config) {
        return new Markdoc.Tag(
          "div",
          { class: "post-callout" },
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
