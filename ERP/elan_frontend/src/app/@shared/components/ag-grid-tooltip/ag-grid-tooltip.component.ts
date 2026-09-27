import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-tooltip',
  templateUrl: './ag-grid-tooltip.component.html',
  styleUrls: ['./ag-grid-tooltip.component.scss']
})
export class AgGridTooltipComponent implements ITooltipAngularComp {

   params: any;
  transporters: any[] = [];

  agInit(params: any): void {
    this.params = params;
    this.transporters = params.data?.transporters || [];
  }

  refresh(): boolean {
    return false;
  }
}