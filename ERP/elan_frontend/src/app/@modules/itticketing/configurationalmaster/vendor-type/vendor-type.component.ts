import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VendorActionComponent } from './vendor-action/vendor-action.component';
import { CoaHierarchyActionComponent } from 'src/app/@modules/finance/coa-hierarchy-action/coa-hierarchy-action.component';

@Component({
  selector: 'app-vendor-type',
  templateUrl: './vendor-type.component.html',
  styleUrls: ['./vendor-type.component.scss'],
})
export class VendorTypeComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedRows: any[] = [];
  isDeleteButtonVisible: boolean = false;

  getDataPath = (data: any) => {
    return data.hierachy;
  };

  public columnDefs: ColDef[] = [
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: VendorActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
  frameworkComponents: any;

  autoGroupColumnDef = {
    headerName: 'Vendor Type',
    field: 'name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 500,
    valueGetter: (params: any) => {
      return params.data.name;
    },
    cellRendererParams: {
      suppressCount: true,
    },
  };

  constructor(
    private router: Router,
    private service: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
    this.frameworkComponents = {
      buttonRenderer: CoaHierarchyActionComponent,
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.service.getAllTravelType('vendor-type').subscribe((data: any) => {
      this.rowData = flattenChildrenRecursively(data.data);
    });
  }

  add(type: string): () => void {
    return () => {
      this.router.navigate([
        'master/configurational-master/travel-master/add-travel-type',
      ], {
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
    const element = document.getElementById('page-size') as HTMLInputElement;
    if (element && this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(element.value));
    }
  }

  onFilterTextBoxChanged() {
    const element = document.getElementById('filter-text-box') as HTMLInputElement;
    if (element && this.gridApi) {
      this.gridApi.setQuickFilter(element.value);
    }
  }
}

const flattenChildrenRecursively = (
  data: any,
  parent = null,
  childHierachy: any = null
) => {
  let newData: any = [];

  if (data) {
    data.forEach((initialRow: any) => {
      let parentHierachy: any = [];
      initialRow.hierachy = parentHierachy;

      if (parent) {
        initialRow.parent = parent;
        parentHierachy = [...childHierachy];
        initialRow.hierachy = parentHierachy;
      }
      parentHierachy.push(initialRow.name);

      newData.push(initialRow);

      if (initialRow.children) {
        newData = [
          ...newData,
          ...flattenChildrenRecursively(
            initialRow.children,
            initialRow,
            parentHierachy
          ),
        ];
      }
    });
  }

  return newData;
};
