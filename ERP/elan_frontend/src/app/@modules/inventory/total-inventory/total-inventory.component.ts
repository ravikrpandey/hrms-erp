import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-total-inventory',
  templateUrl: './total-inventory.component.html',
  styleUrls: ['./total-inventory.component.scss']
})
export class TotalInventoryComponent {
  constructor(private router: Router) {
  }
  redirect1(){

  }
}
