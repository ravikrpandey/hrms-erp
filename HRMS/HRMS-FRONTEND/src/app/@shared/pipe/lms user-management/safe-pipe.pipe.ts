import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'safePipe'
})
export class SafePipePipe implements PipeTransform {

  constructor(private readonly domSanitizer: DomSanitizer) {}

  transform(
    value: string | undefined,
    type: string,
    bypass: boolean
  ):
    | SafeHtml
    | SafeStyle
    | SafeScript
    | SafeUrl
    | SafeResourceUrl
    | SafeValue
    | null {
    if (!value) {
      return null;
    }
    switch (type) {
      case 'style':
        return bypass
          ? this.domSanitizer.bypassSecurityTrustStyle(value)
          : this.domSanitizer.sanitize(SecurityContext.STYLE, value);
      case 'script':
        return bypass
          ? this.domSanitizer.bypassSecurityTrustScript(value)
          : this.domSanitizer.sanitize(SecurityContext.SCRIPT, value);
      case 'url':
        return bypass
          ? this.domSanitizer.bypassSecurityTrustUrl(value)
          : this.domSanitizer.sanitize(SecurityContext.URL, value);
      case 'resourceUrl':
        return bypass
          ? this.domSanitizer.bypassSecurityTrustResourceUrl(value)
          : this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
      default:
        return bypass
          ? this.domSanitizer.bypassSecurityTrustHtml(value)
          : this.domSanitizer.sanitize(SecurityContext.HTML, value);
    }
  }
}
