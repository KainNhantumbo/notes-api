import sanitizeHtml from 'sanitize-html';

export async function sanitizer(content: string): Promise<string> {
  return new Promise((resolve) => {
    const result = sanitizeHtml(content, {
      enforceHtmlBoundary: false,
      allowVulnerableTags: false,
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        '*': ['class', 'style', 'contenteditable', 'type', 'data-*']
      },
      nestingLimit: 50
    });
    resolve(result);
  });
}
