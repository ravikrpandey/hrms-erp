import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookadvance',
  templateUrl: './bookadvance.component.html',
  styleUrls: ['./bookadvance.component.scss']
})
export class BookadvanceComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  bookgrid: any = [];
  entity_Id: any;
  loginUser: any;
  navWidth: number = 0;
  financial_id: any;
  constructor(
    private travel_service: TravelRequestService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage()
    this.get_all_advance_travel_booking()
   
  }

  get_approved_travel_request(){
    this.travel_service.get_approved_travel_request(this.financial_id,this.entity_Id).subscribe((res: any) => {
      this.bookgrid = res.data
    })
  }

  get_all_advance_travel_booking(){
    const payload = {
      "entity_id": this.entity_Id, 
      "financial_year_id": this.financial_id, 
    }
    this.travel_service.get_all_advance_travel_booking(payload).subscribe((res: any) => {
      this.rowData = res.data
    })
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
  }

  public columnDefs: any = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Travel Request Number',
      field: 'travel_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Emp Name ',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Total Amount',
      field: 'advance_total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Payment Type',
      field: 'payment_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
  ];

  public bookadvance: any = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Travel Request Number',
      field: 'travel_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      headerClass: 'underline-header',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Emp Name ',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    }
  ];

  statusCellClicked(e: any) {
    if (e.colDef && e.colDef.headerName === 'Travel Request Number') {
      this.router.navigate(['/master/ess/travel-request/create-travel-request'], {
        queryParams: { id: e.data.id ,Type:"book-advance",Loca:"adv"},
      });
    }
  }

  openNav() {
    this.get_approved_travel_request()
    this.navWidth = 445;
  }

  closeNav() {
    this.navWidth = 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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

}
