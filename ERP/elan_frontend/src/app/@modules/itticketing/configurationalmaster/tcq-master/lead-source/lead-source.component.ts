import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { FreightActionComponent } from '../freight/freight-action/freight-action.component';
import { LeadSourceActionComponent } from './lead-source-action/lead-source-action.component';

@Component({
  selector: 'app-lead-source',
  templateUrl: './lead-source.component.html',
  styleUrls: ['./lead-source.component.scss']
})
export class LeadSourceComponent {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedRows: any[] = [];
  isDeleteButtonVisible: boolean = false;
  financial_id: string = '';
  entity_id: string = '';

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
      field: 'lead_source',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
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
      cellRenderer: LeadSourceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  constructor(
    private router: Router,
    private service: ProposalService
  ) {
    this.entity_id = localStorage.getItem('selectedEntityId')!;
    this.financial_id = localStorage.getItem('financial_id')!;
    this.getData();
  }

  getData() {
    this.service.getLeadSource(this.financial_id, this.entity_id).subscribe((data: any) => {
      this.rowData = data.data;
    });
  }

  add(type: string): () => void {
    return () => {
      this.router.navigate([
        'master/configurational-master/tcq-master/lead-source/create',
      ]);
    };
  }

  onGridReady(params: GridReadyEvent) {
    // this.gridApi = params.api;
    // this.gridApi.addEventListener(
    //   'selectionChanged',
    //   this.onSelectionChanged.bind(this)
    // );
  }

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();
    this.isDeleteButtonVisible = this.selectedRows.length > 0;
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
