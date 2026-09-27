import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { OvertimeRejectComponent } from '../overtime-reject/overtime-reject.component';
import { OvertimeApproveComponent } from '../overtime-approve/overtime-approve.component';

@Component({
  selector: 'app-overtime-request-list',
  templateUrl: './overtime-request-list.component.html',
  styleUrls: ['./overtime-request-list.component.scss']
})
export class OvertimeRequestListComponent {
rowClass: any;
  rowData: any;
  private gridApi!: GridApi<any>;
  selected= new FormControl(0);assignAction: any;
  @ViewChild('rejected') rejectedextraHour!: OvertimeRejectComponent;
  @ViewChild('Approve') toBeApproveTransfer!: OvertimeApproveComponent;

  constructor(
       private router:Router
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
   

  }


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

 
addRedirect(){
   this.router.navigate(['/master/ess/overtime-request/create-request'])
}
 


}

