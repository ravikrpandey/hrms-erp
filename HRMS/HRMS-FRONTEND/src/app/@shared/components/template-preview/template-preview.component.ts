import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'web-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatePreviewComponent implements OnChanges {
  @Input() htmlCode: string = "<h1 style='text-align:center; font-size:14px; font-weight:500'>No template code to preview!</h1>";
  @Input() cssCode: string = "body { font-family: Arial; background: #f4f4f4; }";
  @Input() jsCode: string = "console.log('JS Loaded');";
  previewSrc: SafeResourceUrl = '';
  @Input() fullCode?: string;
  @Input() deviceEmulator = "desktop";
  @ViewChild('iframe') iframe!: ElementRef;
  
  isMobileView: boolean = false;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['htmlCode'] || changes['cssCode'] || changes['jsCode'] || changes['fullCode'] ||changes['deviceEmulator']) {
      this.isMobileView = this.deviceEmulator=='mobile';
     
      this.runCode();
      this.cdr.markForCheck(); // Ensure change detection runs for this component
    }
  }
  // toggleView() {
  //   this.isMobileView = !this.isMobileView;
  //   this.runCode();
  // }
  runCode() {
    const fullCode = this.fullCode ? this.fullCode : `
      <html>
        <head>
          <style>${this.cssCode}</style>
          <script>
            window.onload = function() {
              window.parent.postMessage(document.body.scrollHeight, '*');
            };
          <\/script>
        </head>
        <body>
          ${this.htmlCode}
          <script>${this.jsCode}<\/script>
        </body>
      </html>
    `;
    
    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.previewSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // this.adjustIframeHeight();
  }

  adjustIframeHeight() {
    window.addEventListener('message', (event) => {
      if (this.iframe?.nativeElement) {
        this.iframe.nativeElement.style.height = event.data + 'px';
      }
    });
  }
}
