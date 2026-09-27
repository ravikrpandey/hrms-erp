// rich-text-editor.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { RichTextEditorService } from './rich-text-editor.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextEditorComponent),
    multi: true
  }]
})
export class RichTextEditorComponent implements AfterViewInit {
  @ViewChild('editor') editorRef!: ElementRef<HTMLElement>;
  @Output() contentChange = new EventEmitter<string>();
  @Input() placeholder = '';
  @Input() initialContent = '';
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private editorService: RichTextEditorService) { }

  writeValue(value: string): void {
    if (value !== undefined) {
      this.setContent(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    this.editorService.initialize(this.editorRef.nativeElement, {
      placeholder: this.placeholder,
      onContentChange: (html) => {
        debugger
        this.contentChange.emit(html);
        this.onChange(html);
      }
    });

    if (this.initialContent) {
      this.editorService.setContent(this.initialContent);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    debugger
    if (input.files && input.files.length > 0) {
      this.addAttachment(input.files[0]);
      input.value = ''; // Reset the input
    }
  }

  addAttachment(file: File): void {
    debugger
    this.editorService.addAttachment(file);
  }

  getContent(): string {
    return this.editorService.getContent();
  }

  setContent(html: string): void {
    this.editorService.setContent(html);
  }
  formatText(formatText: string) {
    console.log({formatText})
  }

  clear(): void {
    this.editorService.clear();
  }
}
