import sanitizeHtml from 'sanitize-html';

export async function sanitizer(content: string): Promise<string> {
  return new Promise((resolve) => {
    const result = sanitizeHtml(content, {
      enforceHtmlBoundary: false,
      allowVulnerableTags: false,
      disallowedTagsMode: 'recursiveEscape'
    });
    resolve(result);
  });
}
