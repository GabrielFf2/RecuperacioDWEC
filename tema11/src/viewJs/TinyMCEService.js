import { tinymce } from "tinymce";

export class TinyMCEService {
  static init(selectors) {
    tinymce.init({
      selector: selectors,
      language: 'ca',
      plugins: 'lists link image table code',
      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code',
      api_key: 'oasi6u3843rabe5muosvcjhmotyrcvutfc07tjmg4t2il3wv',
      license_key: 'oasi6u3843rabe5muosvcjhmotyrcvutfc07tjmg4t2il3wv'
    });
  }

  static getEditorContent(editorId) {
    const editor = tinymce.get(editorId);
    return editor ? editor.getContent({ format: 'text' }) : '';
  }

  static setEditorContent(editorId, content) {
    const editor = tinymce.get(editorId);
    if (editor) {
      editor.setContent(content);
    }
  }
}
