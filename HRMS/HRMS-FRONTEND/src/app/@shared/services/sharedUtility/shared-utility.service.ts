import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedUtilityService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getMimeTypeAndExtension(url: string) {
    return this.http
      .request('HEAD', url, { observe: 'response', responseType: 'blob' })
      .pipe(
        map((response: HttpResponse<any>) => {
          const mimeType = response.headers.get('Content-Type') || 'unknown';
          const extension = this.getExtensionFromUrl(url);
          return { mimeType, extension };
        }),
        catchError(() => {
          const extension = this.getExtensionFromUrl(url);
          return of({ mimeType: 'unknown', extension });
        })
      );
  }

  private getExtensionFromUrl(url: string): string {
    const lastSegment = url.split('?')[0].split('/').pop() || '';
    const ext = lastSegment.includes('.') ? lastSegment.split('.').pop()?.toLowerCase() : '';
    return ext || 'unknown';
  }

  handle_API_Error(error: any, toast: boolean = true) {
    if (toast) {
      let msg = error?.error?.error?.message || null;
      if (!msg) {
        msg = error?.error?.message || null;
      }
      if (!msg) {
        msg = error.message || null;
      }
      if (!msg) {
        msg = error.code == 404 ? 'Route not found!' : "An error occured!";
      }
      this.toastr.error(msg);
    }
  }
  getDate(date: string): Date | string {
    if (!date) return ''
    const str = moment(date).format('LLL').toString();
    return str ?? ''
  }
  onImageLoadError(event: Event, img?: string) {
    const target = event.target as HTMLImageElement;
    target.src = img ? img : '../../../assets/img/bg_slider.png'; // Path to your static image;
  }
  createHashtagsLinks(hashtag: string, plateform?: string): string {
    const hashRemoved = hashtag.replace('#', '');
    if (plateform === 'Facebook') {
      return `<a class="hash-tag-link" href = "https://www.facebook.com/hashtag/${hashRemoved}" target="_blank">${hashtag}</a>`;
    }
    else if (plateform === 'Twitter' || plateform === 'X') {
      return `<a class="hash-tag-link" href = "https://twitter.com/hashtag/${hashRemoved}" target="_blank">${hashtag}</a>`;
    }
    else if (plateform === 'LinkedIn') {
      return `<a class="hash-tag-link" href = "https://www.linkedin.com/feed/hashtag/${hashRemoved}/" target="_blank">${hashtag}</a>`;
    }
    // else if (plateform === 'Instagram') {
    //   return `<a class="hash-tag-link" href="https://" target="_blank">${hashtag}</a>`;
    // }
    else {
      return `<span class="hash-tag-link">${hashtag}</span>`;
    }

  }
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    }
  }
}
