
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColumnApi, GridApi } from 'ag-grid-community';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import 'ag-grid-enterprise';
import { CoaHierarchyActionComponent } from '../../coa-hierarchy-action/coa-hierarchy-action.component';
import { CostCenterHierarchyActionComponent } from '../cost-center-hierarchy-action/cost-center-hierarchy-action.component';
// import { ChartAccountActionComponent } from '../chart-account-action/chart-account-action.component';
// import { CoaHierarchyActionComponent } from '../coa-hierarchy-action/coa-hierarchy-action.component';

@Component({
  selector: 'app-cost-center-hierarchy-view',
  templateUrl: './cost-center-hierarchy-view.component.html',
  styleUrls: ['./cost-center-hierarchy-view.component.scss']
})
export class CostCenterHierarchyViewComponent {
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowClass: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  public columnDefs;
  rowData: any;
  getDataPath = (data: any) => {
    return data.hierachy;
  };
  autoGroupColumnDef = {
    headerName: 'Cost Center',
    field: 'name',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 300,
    valueGetter: (params: any) => {
      return params.data.name;
    },
    cellRendererParams: {
      suppressCount: true,
    },
  };
  totalDebit: number = 0.0;
  totalCredit: number = 0.0;
  frameworkComponents: any;

  constructor(private http: HttpClient, private _finaceservice: FinaceService) {
    this.rowClass = 'rowClass';
    this.columnDefs = [
      {
        headerName: 'Type',
        field: 'type',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 200,
        
      },
      {
        headerName: 'Action',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 100,
        cellRenderer: 'buttonRenderer',
      },
      
    ];
    this.frameworkComponents = {
      buttonRenderer: CostCenterHierarchyActionComponent,
    };
    this.prepareData();
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

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private prepareData() {
    const entity_id = localStorage.getItem('selectedEntityId');
    this._finaceservice.getCostCenterHierarchyViewData(entity_id).subscribe(
      (response: any) => {
        if (response) {
          this.categoryData = response.data?.costCenterHierarchyView;
          // this.totalDebit = response.data.totals.total_debit;
          // this.totalCredit = response.data.totals.total_credit;
          this.rowData = flattenChildrenRecursively(this.categoryData);
          // this.toast.success(response.message)
        }
      },
      (err: any) => {
        // this.toast.error(err.error.message);
      }
    );
  }

  categoryData: any = [];

  addChildToSubcategory(
    parentid: number,
    newChild: { id: number; name: string }
  ) {
    const findAndAddChild = (data: any) => {
      for (const item of data) {
        if (item.id === parentid) {
          item.children = item.children || [];
          item.children.push(newChild);
          return true; // Child added
        }
        if (item.children && findAndAddChild(item.children)) {
          return true; // Child added in a nested category
        }
      }
      return false; // Not found
    };

    findAndAddChild(this.categoryData);
    this.prepareData(); // Refresh the grid data
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
