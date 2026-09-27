import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-tabs',
  templateUrl: './all-tabs.html',
  styleUrls: ['./all-tabs.scss']
})
export class AllTabs {
 constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/master/ess/upload-declaration']); 
  }
}
