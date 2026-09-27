import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-dashboard',
  templateUrl: './iframe-dashboard.html',
  styleUrls: ['./iframe-dashboard.scss']
})
export class IframeDashboard {
  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const url = 'https://hrms-analytics-hub-fmj7g37.public.builtwithrocket.new';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
