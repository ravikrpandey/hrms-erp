import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { AllocatedTicketActionComponent } from '../allocated-ticket-action/allocated-ticket-action.component';

@Component({
  selector: 'app-allocated-tickets',
  templateUrl: './allocated-tickets.component.html',
  styleUrls: ['./allocated-tickets.component.scss']
})
export class AllocatedTicketsComponent {


  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  loginUser: any;

  constructor(
    private $helpdestService: HelpdeskService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getTiketList();
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Ticket Id',
      field: 'id', // Use 'id' as the base field
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => `TC00${params.data.id}`
    },
    {
      headerName: 'Category Id',
      field: 'categoryCode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Employe Name',
      // field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.first_name + ' ' + params.data.last_name;
      }
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },

    {
      headerName: 'Status',
      field: 'user_ticket_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,

    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AllocatedTicketActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

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

  getTiketList() {
    this.$helpdestService.get_allocated_ticket_LIST(this.loginUser?.employee_id).subscribe((res: any) => {
      this.rowData = res.data;
    })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  addMyTicket() {
    this.route.navigate(['/master/ess/my-tickets/create-allocate-ticket'])
  }
}
