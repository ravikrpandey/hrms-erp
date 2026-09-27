import { Component } from '@angular/core';
import { FGListService } from 'src/app/@shared/services/warehouse/fg-list.service';

@Component({
  selector: 'app-store-stock-acknowledge',
  templateUrl: './store-stock-acknowledge.component.html',
  styleUrls: ['./store-stock-acknowledge.component.scss']
})

export class StoreStockAcknowledgeComponent {
  selectedTab = 0; 
  constructor( private $fgList: FGListService){

  }

  onTabChange(event: any) {
    this.selectedTab = event.index; 
  }

}

