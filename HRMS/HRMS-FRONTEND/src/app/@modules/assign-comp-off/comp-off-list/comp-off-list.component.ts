import { Component, Inject, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comp-off-list',
  templateUrl: './comp-off-list.component.html',
  styleUrls: ['./comp-off-list.component.scss'],
})
export class CompOffListComponent implements OnInit {
  listData: any[] = [];
  rowData: any[] = [];
  selectedEntityId: any;
  employeeCount: number = 0;
  rowClass: any;
  private gridApi!: GridApi<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comservice: CompServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllCompOffData();
  }

  getAllCompOffData() {
    const entity = localStorage.getItem('selectedEntityId');
    const created_by = localStorage.getItem('EmpMainId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');
      return;
    }
    this.comservice
      .getOnlyLoginUserData(this.selectedEntityId, created_by)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.listData = res.data;
            this.rowData = res.data;
            this.employeeCount = res.data.length;
          } else {
            console.error('Invalid response format', res);
            this.rowData = [];
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.rowData = [];
        }
      );
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) =>
      params.node ? params.node.rowIndex + 1 : '',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 100,
    },
    {
      headerName: 'Requested By',
      valueGetter: (params: any) => {
        const { creator_first_name, creator_middle_name, creator_last_name } =
          params.data;
        return [creator_first_name, creator_middle_name, creator_last_name]
          .filter(Boolean)
          .join(' ');
      },
      sortable: true,
      resizable: true,
      flex: 1,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'From',
      field: 'from_date',
      sortable: true,
      resizable: true,
      flex: 1,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'To',
      field: 'to_date',
      sortable: true,
      flex: 1,
      resizable: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Reason',
      field: 'reason',
      cellRenderer: (params: any) => {
        return `
          <mat-icon class="view-icon-btn" title="View Reason">
            <span class="material-icons">visibility</span>
          </mat-icon>

      
        `;
      },
      cellClass: 'grid-cell-centered',
      sortable: false,
      flex: 1,
      resizable: false,
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    const value = (
      document.getElementById('filter-text-box') as HTMLInputElement
    ).value;
    this.gridApi.setQuickFilter(value);
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onCellClicked(event: any): void {
    if (event.colDef.field === 'reason') {
      const clickedElement = event.event.target as HTMLElement;
      if (
        clickedElement.classList.contains('material-icons') ||
        clickedElement.closest('.view-icon-btn')
      ) {
        this.dialog.open(ReasonPopupDialogInline, {
          width: '400px',
          data: { reason: event.data.reason || 'No reason provided' },
        });
      }
    }
  }
}

@Component({
  selector: 'app-reason-popup-dialog-inline',
  template: `
    <h2 mat-dialog-title>Reason</h2>
    <mat-dialog-content>
      <p>{{ data.reason }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class ReasonPopupDialogInline {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
