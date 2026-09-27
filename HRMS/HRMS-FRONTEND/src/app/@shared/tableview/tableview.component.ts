import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-tableview',
  standalone:true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './tableview.component.html',
  styleUrls: ['./tableview.component.css']
})
export class TableviewComponent implements OnChanges, OnInit{
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() pagination: boolean = true;
  @Input() rowSelection: any = 'multiple';
  @Input() paginationPageSize: number = 20;
  @Input() theme: string = 'ag-theme-alpine'; // you can also pass 'ag-theme-dark', etc.
  pinnedRight:boolean=false
   ngOnInit() {
    let pinnedRightCheck = this.columnDefs.find((a:any)=> a?.pinned === 'right')
    if(pinnedRightCheck){
      this.pinnedRight = true
    } 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData']) {
      this.rowData = changes['rowData']?.currentValue;
    }
  }
  gridApi: any;

@Output() gridReadyEvent = new EventEmitter<any>();

onGridReady(params: any) {
    this.gridApi = params.api;
     this.gridApi.sizeColumnsToFit()
    this.gridReadyEvent.emit(params);
}
  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    editable: false
  };

@Output() selectionChanged = new EventEmitter<any[]>();
 
  onSelectionChanged(event: any) {
  const selectedRows = this.gridApi.getSelectedRows();
  this.selectionChanged.emit(selectedRows); // Emit selected employees
}

}
