import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ReimbursementActionComponent } from './reimbursement-action/reimbursement-action.component';

@Component({
  selector: 'app-reimbursement-master',
  templateUrl: './reimbursement-master.component.html',
  styleUrls: ['./reimbursement-master.component.scss']
})
export class ReimbursementMasterComponent {
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedRows: any[] = [];
  isDeleteButtonVisible: boolean = false;

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
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
      headerName: 'Name',
      field: 'name',
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
      cellRenderer: ReimbursementActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  constructor(
    private router: Router,
    private service: ConfigurationalmasterService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.service.getAllTravelType('reimbursement').subscribe((data: any) => {
      this.rowData = data.data || [];
    });
  }

  add(type: string) {
    this.router.navigate(
      ['/master/configurational-master/reimbursement-master/reimbursement/create'],
      {
        queryParams: { type },
      }
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'selectionChanged',
      this.onSelectionChanged.bind(this)
    );
  }

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();
    this.isDeleteButtonVisible = this.selectedRows.length > 0;
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLSelectElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    const value = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.gridApi.setQuickFilter(value);
  }
}
