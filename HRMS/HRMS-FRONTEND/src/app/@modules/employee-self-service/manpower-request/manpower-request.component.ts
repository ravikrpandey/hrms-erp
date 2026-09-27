import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manpower-request',
  templateUrl: './manpower-request.component.html',
  styleUrls: ['./manpower-request.component.scss']
})
export class ManpowerRequestComponent {
  currentUrl: any;
  showBtn: boolean = false;
  constructor(private route: Router
  ) {
    this.currentUrl = this.route.url;
    console.log('Current URL:', this.currentUrl);

    if (this.currentUrl == '/master/recruitment/manpower-request/my-request-manpower') {
      this.showBtn = true
    } else {
      this.showBtn = false

    }
  }

  ngOnInit(): void {

  }
  navigate() {
    this.route.navigate(['master/ess/manpower-request/new-request-create'])
  }
}

