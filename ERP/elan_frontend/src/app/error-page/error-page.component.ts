import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})
export class ErrorPageComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
