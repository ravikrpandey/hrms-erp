// rich-text-editor.service.ts
import { Injectable } from '@angular/core';
// import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';

export interface EditorOptions {
  placeholder?: string;
  onContentChange?: (html: string) => void;
}

export interface Mention {
  id: string;
  name: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Emoji {
  char: string;
  name: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class RichTextEditorService {
  private editorElement: HTMLElement | null = null;

  initialize(element: HTMLElement, options: EditorOptions = {}): void {
    this.editorElement = element;
    this.editorElement.contentEditable = 'true';

    // Apply basic styling
    this.editorElement.style.minHeight = '1rem';
    this.editorElement.style.border = '1px solid #ccc';
    this.editorElement.style.padding = '8px';
    this.editorElement.style.borderRadius = '4px';
    this.editorElement.style.outline = 'none';

    // Setup placeholder if provided
    if (options.placeholder) {
      this.setupPlaceholder(options.placeholder);
    }

    // Setup event listeners
    this.setupEventListeners(options.onContentChange);
  }

  private setupPlaceholder(placeholder: string): void {
    if (!this.editorElement) return;

    if (!this.editorElement.textContent?.trim()) {
      this.editorElement.textContent = placeholder;
      this.editorElement.style.color = '#999';
    }

    this.editorElement.addEventListener('focus', () => {
      if (this.editorElement?.textContent === placeholder) {
        this.editorElement.textContent = '';
        this.editorElement.style.color = '';
      }
    });

    this.editorElement.addEventListener('blur', () => {
      if (!this.editorElement?.textContent?.trim()) {
        if (this.editorElement) {
          this.editorElement.textContent = placeholder;
        }
        if (this.editorElement) {
          this.editorElement.style.color = '#999';
        }
      }
    });
  }
  private insertMention(mention: Mention): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const mentionElement = document.createElement('span');
    mentionElement.className = 'mention';
    mentionElement.contentEditable = 'false';
    mentionElement.dataset['mentionId'] = mention.id;
    mentionElement.textContent = `@${mention.name}`;
    mentionElement.style.backgroundColor = '#e0f2ff';
    mentionElement.style.borderRadius = '3px';
    mentionElement.style.padding = '0 2px';

    range.insertNode(mentionElement);

    // Add a space after the mention
    const space = document.createTextNode(' ');
    range.insertNode(space);

    // Move cursor after the space
    range.setStartAfter(space);
    range.setEndAfter(space);
    selection.removeAllRanges();
    selection.addRange(range);

    if (this.editorElement) {
     this.editorElement.focus();
    }
  }
  private showMentionSuggestions(): void {
    // In a real app, you'd fetch these from an API
    const suggestions: Mention[] = [
      { id: '1', name: 'John Doe', avatar: 'https://example.com/avatar1.jpg' },
      { id: '2', name: 'Jane Smith', avatar: 'https://example.com/avatar2.jpg' },
      { id: '3', name: 'Bob Johnson' }
    ];

    const dropdown = this.createDropdown(suggestions.map(user => ({
      text: user.name,
      data: user,
      onClick: () => this.insertMention(user)
    })));

    this.positionDropdownAtCaret(dropdown);
  }
  private showEmojiPicker(): void {
    // In a real app, you'd use a proper emoji dataset
    const emojis: Emoji[] = [
      { char: '😀', name: 'grinning', category: 'smileys' },
      { char: '😂', name: 'joy', category: 'smileys' },
      { char: '👍', name: 'thumbsup', category: 'people' },
      // ... more emojis
    ];

    const dropdown = document.createElement('div');
    dropdown.className = 'emoji-picker';
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ddd';
    dropdown.style.borderRadius = '8px';
    dropdown.style.padding = '8px';
    dropdown.style.zIndex = '1000';
    dropdown.style.maxHeight = '300px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

    emojis.forEach(emoji => {
      const emojiButton = document.createElement('button');
      emojiButton.textContent = emoji.char;
      emojiButton.style.fontSize = '20px';
      emojiButton.style.padding = '4px';
      emojiButton.style.border = 'none';
      emojiButton.style.background = 'none';
      emojiButton.style.cursor = 'pointer';
      emojiButton.title = emoji.name;

      emojiButton.addEventListener('click', () => {
        this.insertEmoji(emoji.char);
        dropdown.remove();
      });

      dropdown.appendChild(emojiButton);
    });

    this.positionDropdownAtCaret(dropdown);
  }

  private insertEmoji(emoji: string): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    document.execCommand('insertText', false, emoji);
    if (this.editorElement)
    this.editorElement.focus();
  }

  private setupEventListeners(onContentChange?: (html: string) => void): void {
    if (!this.editorElement) return;

    this.editorElement.addEventListener('input', () => {
      if (onContentChange && this.editorElement) {
        onContentChange(this.editorElement.innerHTML);
      }
    });

    this.editorElement.addEventListener('keydown', (event) => {
      if (!this.editorElement) return;

      if (event.key === '@') {
        this.showMentionSuggestions();
      } else if (event.key === '#') {
        this.showHashtagSuggestions();
      } else if (event.key === ':' && event.ctrlKey) {
        this.showEmojiPicker();
      }
    });

    this.editorElement.addEventListener('paste', (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData('text/plain') || '';
      document.execCommand('insertText', false, text);
    });
  }
  private createDropdown(items: Array<{ text: string; onClick: () => void; data?: any }>): HTMLElement {
    const dropdown = document.createElement('div');
    dropdown.className = 'suggestions-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ddd';
    dropdown.style.borderRadius = '4px';
    dropdown.style.zIndex = '1000';
    dropdown.style.maxHeight = '200px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    items.forEach(item => {
      const option = document.createElement('div');
      option.textContent = item.text;
      option.style.padding = '8px 12px';
      option.style.cursor = 'pointer';

      option.addEventListener('mouseenter', () => {
        option.style.backgroundColor = '#f5f5f5';
      });

      option.addEventListener('mouseleave', () => {
        option.style.backgroundColor = '';
      });

      option.addEventListener('click', () => {
        item.onClick();
        dropdown.remove();
      });

      dropdown.appendChild(option);
    });

    document.body.appendChild(dropdown);
    return dropdown;
  }

  private positionDropdownAtCaret(dropdown: HTMLElement): void {
    const range = window.getSelection()?.getRangeAt(0);
    if (!range) return;

    const rect = range.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;

    // Close dropdown when clicking outside
    const clickOutsideHandler = (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node)) {
        dropdown.remove();
        document.removeEventListener('click', clickOutsideHandler);
      }
    };

    document.addEventListener('click', clickOutsideHandler);
  }

  private showHashtagSuggestions(): void {
    // In a real app, you'd fetch trending hashtags
    const suggestions = ['typescript', 'webdev', 'programming', 'javascript'];

    const dropdown = this.createDropdown(suggestions.map(tag => ({
      text: `#${tag}`,
      onClick: () => this.insertHashtag(tag)
    })));

    this.positionDropdownAtCaret(dropdown);
  }

  private insertHashtag(tag: string): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const hashtagElement = document.createElement('span');
    hashtagElement.className = 'hashtag';
    hashtagElement.contentEditable = 'false';
    hashtagElement.dataset['tag'] = tag;
    hashtagElement.textContent = `#${tag}`;
    hashtagElement.style.color = '#1da1f2';
    hashtagElement.style.fontWeight = 'bold';

    range.insertNode(hashtagElement);

    // Add a space after the hashtag
    const space = document.createTextNode(' ');
    range.insertNode(space);

    // Move cursor after the space
    range.setStartAfter(space);
    range.setEndAfter(space);
    selection.removeAllRanges();
    selection.addRange(range);

    if (this.editorElement) {
      this.editorElement.focus();
     }
  }

  // Implement all the other methods from the original class
  // (showMentionSuggestions, insertMention, showHashtagSuggestions, etc.)
  // ...
  public addAttachment(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const attachment: Attachment = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: e.target?.result as string
      };

      this.insertAttachment(attachment);
      debugger
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      // For non-image files, we'll just show the file info
      this.insertAttachment({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: ''
      });
    }
  }

  private insertAttachment(attachment: Attachment): void {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const attachmentElement = document.createElement('div');
    attachmentElement.className = 'attachment';
    attachmentElement.contentEditable = 'false';
    attachmentElement.dataset['attachmentId'] = attachment.id;

    if (attachment.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = attachment.url;
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      attachmentElement.appendChild(img);
    } else {
      const fileInfo = document.createElement('div');
      fileInfo.textContent = `${attachment.name} (${this.formatFileSize(attachment.size)})`;
      fileInfo.style.padding = '8px';
      fileInfo.style.backgroundColor = '#f5f5f5';
      fileInfo.style.borderRadius = '4px';
      fileInfo.style.border = '1px dashed #ccc';
      attachmentElement.appendChild(fileInfo);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.style.position = 'absolute';
    deleteButton.style.right = '0';
    deleteButton.style.top = '0';
    deleteButton.style.background = 'red';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '50%';
    deleteButton.style.width = '20px';
    deleteButton.style.height = '20px';
    deleteButton.style.cursor = 'pointer';

    deleteButton.addEventListener('click', () => {
      attachmentElement.remove();
    });

    attachmentElement.style.position = 'relative';
    attachmentElement.style.display = 'inline-block';
    attachmentElement.style.margin = '4px';
    attachmentElement.appendChild(deleteButton);

    range.insertNode(attachmentElement);

    // Add a line break after the attachment
    const br = document.createElement('br');
    range.insertNode(br);

    // Move cursor after the line break
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);

    if (this.editorElement) {
      this.editorElement.focus();
     }
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getContent(): string {
    debugger
    return this.editorElement?.innerHTML || '';
  }

  setContent(html: string): void {
    if (this.editorElement) {
      this.editorElement.innerHTML = html;
      debugger
    }
  }

  clear(): void {
    if (this.editorElement) {
      this.editorElement.innerHTML = '';
    }
  }
}
