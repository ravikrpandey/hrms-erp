import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-production-inventory-allocation',
  templateUrl: './production-inventory-allocation.component.html',
  styleUrls: ['./production-inventory-allocation.component.scss']
})
export class ProductionInventoryAllocationComponent {
  constructor(private router: Router) {
  }
  redirect1(){

  }
}
