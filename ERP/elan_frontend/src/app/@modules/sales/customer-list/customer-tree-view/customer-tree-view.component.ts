import { Component } from '@angular/core';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-customer-tree-view',
  templateUrl: './customer-tree-view.component.html',
  styleUrls: ['./customer-tree-view.component.scss']
})
export class CustomerTreeViewComponent {

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
      headerName: 'Company Name',
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
    totalDebit: number = 0.0;
    totalCredit: number = 0.0;
    frameworkComponents: any;
  
    constructor(private salesService: SalesService,) {
      this.rowClass = 'rowClass';
      this.columnDefs = [
        
        {
          headerName: 'Company Code',
          field: 'customer_code',
          sortable: true,
          resizable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellClass: 'grid-cell-centered',
          flex: 1,
          minWidth: 300,
          hide:false
        },
        // {
        //   headerName: 'Type Name',
        //   field: 'type',
        //   sortable: true,
        //   resizable: true,
        //   wrapHeaderText: true,
        //   autoHeaderHeight: true,
        //   cellClass: 'grid-cell-centered',
        //   flex: 1,
        //   minWidth: 250,
              
        // },
        // {
        //   headerName: 'Action',
        //   sortable: true,
        //   resizable: true,
        //   wrapHeaderText: true,
        //   autoHeaderHeight: true,
        //   cellClass: 'grid-cell-centered',
        //   flex: 1,
        //   minWidth: 100,
        //   cellRenderer: 'buttonRenderer',
        // },
      ];
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
      this.salesService.getCustomerTreeView(entity_id).subscribe(
        (response: any) => {
          if (response) {
            this.categoryData = response.costCenterHierarchyView;
            this.rowData = flattenChildrenRecursively(this.categoryData);
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

}
