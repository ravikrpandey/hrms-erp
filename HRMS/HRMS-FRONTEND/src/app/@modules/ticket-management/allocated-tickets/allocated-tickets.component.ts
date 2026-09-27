import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionCellRenderer } from '../action-cell-renderer/action-cell-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ModalContentComponentComponent } from '../modal-content-component/modal-content-component.component';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-allocated-tickets',
  templateUrl: './allocated-tickets.component.html',
  styleUrls: ['./allocated-tickets.component.scss'],
})
export class AllocatedTicketsComponent implements OnInit {
  displayStyle: any = 'none';
  rowData: any[] = [];
  loginUserDetail: any;
  rowClass: any;
  private gridApi!: GridApi<any>;

  constructor(
    private $helpdestService: HelpdeskService,
    private route: Router
  ) {}

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.loginUserDetail = JSON.parse(lg);
    this.get_allocated_ticket_LIST();
  }

  public columnDefs: any = [
    {
      headerName: 'S.NO',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
      valueGetter: (params: any) => `TC00${params.data.id}`,
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
    },
    {
      headerName: 'Ticket for Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'user_ticket_status',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Name',
      // field: 'first_name',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.first_name + ' ' + params.data.last_name;
      },
    },
    {
      headerName: 'Action',
      field: 'helpDiskId',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const viewButton = document.createElement('button');
        viewButton.classList.add('btn', 'btn-primary');
        viewButton.innerHTML = '<i class="fa fa-eye"></i> View';
        viewButton.addEventListener('click', () => {
          const helpDiskId = params.data.id;
          this.route.navigate(['/master/ess/my-tickets/create-my-ticket'], {
            queryParams: { id: helpDiskId, actionType: 'view' },
          });
        });
        return viewButton;
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  // get all ticket
  get_allocated_ticket_LIST() {
    debugger;
    this.$helpdestService
      .get_allocated_ticket_LIST(null)
      .subscribe((response) => {
        if (response) {
          let res: any = response;
          this.rowData = res?.data;
        }
      });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
}
