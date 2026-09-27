import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DispatchListActionComponent } from '../dispatch-list-action/dispatch-list-action.component';
import { DispatchedService } from 'src/app/@shared/services/warehouse/dispatched.service';

@Component({
  selector: 'app-order-dispatched-list',
  templateUrl: './order-dispatched-list.component.html',
  styleUrls: ['./order-dispatched-list.component.scss']
})
export class OrderDispatchedListComponent {
  rowClass: string;
  matBtnColor : any;
  loginUser: any;
  employee_ids: any;
  constructor(
    private router: Router,
    private fb :FormBuilder,
    private dispatchedServices : DispatchedService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {

    this.dispatchedOrderList();
  }



  getDispatchFormSetup(data: any) {
    if (data == 1) this.matBtnColor = false;
    else this.matBtnColor = true;
  }

  rowData:any[] = [];
  rowData2:any[] = [];
  dispatchedOrderList(){

    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this.employee_ids = this.loginUser.employee_id;
    this.dispatchedServices.dispatchedOrderList(this.employee_ids).subscribe({
      next:(value)=> {
        this.rowData2= value.data
      },
    })
  }
  public columnDefs2 = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      width:20
    },
    {
      headerName: 'DO No',
      field: 'order_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Sales Order No',
      field: 'proposal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'DO Date',
      field: 'do_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Customer Name',
      field: 'contact_person_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'order_no_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: DispatchListActionComponent,
      cellRendererParams: {
        viewDetails:true,
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];
}
