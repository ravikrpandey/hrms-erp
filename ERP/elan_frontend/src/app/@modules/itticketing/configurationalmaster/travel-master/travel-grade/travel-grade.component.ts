import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoaHierarchyActionComponent } from 'src/app/@modules/finance/coa-hierarchy-action/coa-hierarchy-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { TravelTypeActionComponent } from '../travel-type/travel-type-action/travel-type-action.component';
import { GradeActionComponent } from './grade-action/grade-action.component';

@Component({
  selector: 'app-travel-grade',
  templateUrl: './travel-grade.component.html',
  styleUrls: ['./travel-grade.component.scss']
})
export class TravelGradeComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
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
      cellRenderer: GradeActionComponent,
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
    private service: ConfigurationalmasterService
  ) {
    this.getData();
  }

  getData() {
    this.service.getAllTravelType("grade").subscribe((data: any) => {
      this.rowData = data.data;
    });
  }

  add(type: string): () => void {
    return () => {
      this.router.navigate([
        'master/configurational-master/travel-master/add-travel-type',
      ],{
        queryParams: { type },
      });
    };
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