import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// export class CentralColumnDefinitionsService {
//   private columnDefs: any[] = [];
//   private columnDefs1:any[] = [];

//   generateColumns(headersAndFields: { headerName: string; field: string; cellRenderer?: any; cellRendererParams?: any; valueGetter?: any, width?: number }[]): void {
//     this.columnDefs = headersAndFields.map((item) => {
//       const columnDef: any = {
//         headerName: item.headerName,
//         field: item.field,
//         sortable: true,
//         resizable: true,
//         wrapHeaderText: true,
//         autoHeaderHeight: true,
//         cellClass: "grid-cell-centered",
//         flex: 1,
//         minWidth: 100,
//         // Add other default properties here
//       };

//       // If a custom width is specified, set it for the column
//       if (item.width) {
//         columnDef['width'] = item.width;
//       }
      
//       // If a cellRenderer is specified, add it to the column definition
//       if (item.cellRenderer) {
//         columnDef['cellRenderer'] = item.cellRenderer;
//       }

//       // If cellRendererParams are specified, add them to the column definition
//       if (item.cellRendererParams) {
//         columnDef['cellRendererParams'] = item.cellRendererParams;
//       }
//       if (item.valueGetter) {
//         columnDef['valueGetter'] = item.valueGetter;
//       }

//       return columnDef;
//     });
//   }

//   getColumnDefs(): any[] {
//     return this.columnDefs;
//   }

//   /* Only RFP Code Start */
//   generateColumns1(headersAndFields: { headerName: string; field: string; cellRenderer?: any; cellRendererParams?: any; valueGetter?: any, width?: number }[]): void {
//     this.columnDefs1 = headersAndFields.map((item) => {
//       const columnDef: any = {
//         headerName: item.headerName,
//         field: item.field,
//         sortable: true,
//         resizable: true,
//         wrapHeaderText: true,
//         autoHeaderHeight: true,
//         cellClass: "grid-cell-centered",
//         flex: 1,
//         // minWidth: 122,
//         // Add other default properties here
//       };

//       // If a custom width is specified, set it for the column
//       if (item.width) {
//         columnDef['width'] = item.width;
//       }
      
//       // If a cellRenderer is specified, add it to the column definition
//       if (item.cellRenderer) {
//         columnDef['cellRenderer'] = item.cellRenderer;
//       }

//       // If cellRendererParams are specified, add them to the column definition
//       if (item.cellRendererParams) {
//         columnDef['cellRendererParams'] = item.cellRendererParams;
//       }
//       if (item.valueGetter) {
//         columnDef['valueGetter'] = item.valueGetter;
//       }

//       return columnDef;
//     });
//   }
//   getColumnDefs1(): any[] {
//     return this.columnDefs1;
//   }
//    /* Only RFP Code End */
// }
export class CentralColumnDefinitionsService {
  private columnDefs: any[] = [];
  private columnDefs1: any[] = [];
  private columnDefs2: any[] = [];

  generateColumns(headersAndFields: { headerName: string; field: string; cellRenderer?: any; cellRendererParams?: any; valueGetter?: any, width?: number ,tooltipField?: string,tooltipValueGetter?: any}[]): void {
    this.columnDefs = headersAndFields.map((item) => this.createColumnDef(item));
  }
 

  getColumnDefs(): any[] {
    return this.columnDefs;
  }


  generateColumns1(headersAndFields: { 
    headerName: string; 
    field: string; 
    cellRenderer?: any; 
    cellRendererParams?: any; 
    valueGetter?: any; 
    width?: number; 
    tooltipField?: string; 
    tooltipValueGetter?: any; 
  }[]): void {
  
    // Define the checkbox column
    const checkboxColumn = {
      headerName: '',
      field: 'checkbox',
      filter: true,
      sortable: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    
    };
  
    this.columnDefs1 = [
      checkboxColumn,
      ...headersAndFields.map((item) => this.createColumnDef(item))
    ];
  }
  generateColumns3(headersAndFields: { 
    headerName: string; 
    field: string; 
    cellRenderer?: any; 
    cellRendererParams?: any; 
    valueGetter?: any; 
    width?: number; 
    tooltipField?: string; 
    tooltipValueGetter?: any; 
  }[]): void {
  
  
  
    this.columnDefs1 = [
     
      ...headersAndFields.map((item) => this.createColumnDef(item))
    ];
  }

  getColumnDefs1(): any[] {
    return this.columnDefs1;
  }
  getColumnDefs3(): any[] {
    return this.columnDefs1;
  }
  generateColumns2(headersAndFields: { headerName: string; field: string; cellRenderer?: any; cellRendererParams?: any; valueGetter?: any, width?: number,tooltipField?: string,tooltipValueGetter?: any }[]): void {
  

    this.columnDefs2 = [...headersAndFields.map((item) => this.createColumnDef(item))];
  }


  getColumnDefs2(): any[] {
    return this.columnDefs2;
  }

  private createColumnDef(item: { headerName: string; field: string; cellRenderer?: any; cellRendererParams?: any; valueGetter?: any, width?: number,tooltipField?: string ,tooltipValueGetter?: any}): any {
    const columnDef: any = {
      headerName: item.headerName,
      field: item.field,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      // Add other default properties here
    };

    // If a custom width is specified, set it for the column
    if (item.width) {
      columnDef['width'] = item.width;
    }

    // If a cellRenderer is specified, add it to the column definition
    if (item.cellRenderer) {
      columnDef['cellRenderer'] = item.cellRenderer;
    }

    // If cellRendererParams are specified, add them to the column definition
    if (item.cellRendererParams) {
      columnDef['cellRendererParams'] = item.cellRendererParams;
    }

    if (item.valueGetter) {
      columnDef['valueGetter'] = item.valueGetter;
    }
    if (item.tooltipField) {
      columnDef.tooltipField = item.tooltipField;
    }

    // If a tooltipValueGetter is specified, add it to the column definition
    if (item.tooltipValueGetter) {
      columnDef.tooltipValueGetter = item.tooltipValueGetter;
    }
    return columnDef;
  }
}
