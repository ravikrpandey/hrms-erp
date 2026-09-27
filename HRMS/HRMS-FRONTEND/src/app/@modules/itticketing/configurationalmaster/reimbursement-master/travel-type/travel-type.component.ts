import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { TravelTypeActionComponent } from './travel-type-action/travel-type-action.component';
// import { CoaHierarchyActionComponent } from 'src/app/@modules/finance/coa-hierarchy-action/coa-hierarchy-action.component';

@Component({
  selector: 'app-travel-type',
  templateUrl: './travel-type.component.html',
  styleUrls: ['./travel-type.component.scss'],
})
export class TravelTypeComponent {
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
      cellRenderer: TravelTypeActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];
  frameworkComponents: any;
  
  autoGroupColumnDef = {
    headerName: 'Travel Type',
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
    this.getData();

    // this.frameworkComponents = {
    //       buttonRenderer: CoaHierarchyActionComponent,
    //     };
  }

  getData() {
    this.service.getAllTravelType("travel").subscribe((data: any) => {
          this.rowData = flattenChildrenRecursively(data.data);
    });
  }
add(type: string): void {
  this.router.navigate(
    [
      'master/configurational-master/reimbursement-master/add-travel-type',
    ],
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
