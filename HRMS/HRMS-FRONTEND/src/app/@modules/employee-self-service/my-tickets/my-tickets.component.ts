import { Component } from '@angular/core';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent {
  selectedTab: number = 0; 

  onTabChange(index: number) {
    this.selectedTab = index;
  }
  constructor() {

  }

  ngOnInit() {
  }

}
