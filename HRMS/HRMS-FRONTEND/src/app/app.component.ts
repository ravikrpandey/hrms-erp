import { Component, HostListener, DoCheck, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HeadService } from './@shared/services/head.service';
import { HeaderComponent } from './@shared/header/header.component';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  @ViewChild('header', { static: true }) header: HeaderComponent;

  isLoggedIn$!: Observable<boolean>;

  constructor(
    private head: HeadService,
    private router: Router,
    private title: Title,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.head?.isLoggedIn;

    // ---------- Page Title Handling ----------
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const segments = url.split('/').filter(s => s);

        if (!segments.length) {
          this.title.setTitle('Zyno HRMS');
          return;
        }

        const last = segments[segments.length - 1];
        const formatted = this.format(last);
        this.title.setTitle(`${formatted} | Zyno HRMS`);
      });

    // ---------- Save Last Page (Exclude Offline Page) ----------
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects !== '/offline') {
          localStorage.setItem('lastPage', event.urlAfterRedirects);
        }
      });

    // ---------- Offline/Online Detection ----------
    this.checkConnection();

    window.addEventListener('offline', () => this.goOffline());
    window.addEventListener('online', () => this.goOnline());
  }

  // Initial load check
  checkConnection() {
    if (!navigator.onLine) this.goOffline();
  }

  // Go to offline page
  goOffline() {
    this.router.navigateByUrl('/offline');
  }

  // Restore last visited page
  goOnline() {
    const last = localStorage.getItem('lastPage') || '/';
    setTimeout(() => {
      this.router.navigateByUrl(last);
    }, 100); // Give router time to stabilize
  }

  // Format title
  format(segment: string) {
    return segment
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  ngDoCheck(): void {}

  // Click highlight example
  onClick(event: any) {
    this.renderer.addClass(this.el.nativeElement, 'highlight');
  }
  
  onClick22() {}

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event): void {
    this.onClick(event);
  }
}
