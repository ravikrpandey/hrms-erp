import { Component } from '@angular/core';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { AssetLogoComponent } from '../asset-list/asset-logo/asset-logo.component';
import { GridApi ,GridReadyEvent,
  ICellRendererParams} from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { AssetSaleWriteoffFormComponent } from '../asset-sale-writeoff-form/asset-sale-writeoff-form.component';
import { Router } from '@angular/router';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-asset-sale-writeoff',
  templateUrl: './asset-sale-writeoff.component.html',
  styleUrls: ['./asset-sale-writeoff.component.scss']
})
export class AssetSaleWriteoffComponent {

  rowData: any;
  entity_id:any;
  emp_id: any;
  public gridOptions: any = {    rowSelection: 'multiple', rowHeight: 55};
  private gridApi!: GridApi<any>;
  rowClass: string = 'rowClass';
  selectedIndex: number = 0;
  tabsList: any[] = ['All Assets', 'Sold and Discard Assets'];

  selectedTabIndex: any;
  rowData_SD:any;
  assignAction: any;
  lastSegment: any;
  rowList:any;
  rowSelection:any = {
    mode: "multiRow",
  };

  constructor(private asset_service:AssetListService,
    private dialog: MatDialog,
    private route: Router,
    private _rbackService : RbacMasterService,
    private toaster: ToastrService,
  ){
    this.assignAction = this._rbackService.accessAssignAction();

  }
  ngOnInit(){
    const fullUrl = this.route.url;
    this.lastSegment = fullUrl.split('/').pop();
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id= loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getAssetList();

  }

  getAssetList(){
    this.asset_service.getAllAsset(this.emp_id,this.entity_id).subscribe((res:any)=>{
        if(res.data){
         this.rowData=res.data;
        }
    },(err:any)=>{
      this.rowData=[]
    })
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e:any){
  }

  agInit(params: ICellRendererParams): void {

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
  public columnDefs = [
    {
      headerName: '',
      headerCheckboxSelection: true,
      width: 30,
     checkboxSelection: (params: any) => {
        return !(
          params.data?.asset_loc_status === 'ALLOCATED' &&
          params.data?.allocation_type === 'allocated to employee'
        );
      },
    },
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 75
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.asset_tagId ? params.data.asset_tagId : '-----------';
      }
    },
    {
      headerName: 'Po No',
      field: 'po_number',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.po_number ? params.data.po_number : 'NA';
      }
    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.itemSerialNo ? params.data.itemSerialNo : '-----------';
      }
    },
    {
      headerName: 'Batch No',
      field: 'batchNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.batchNo ? params.data.batchNo : 'NA';
      }
    },
    {
      headerName: 'Image',
      field: 'item_document',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Item Status',
      field: 'status_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Item Category',
      field: 'asset_category_name',
      filter: 'agSetColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Billing Address',
      field: 'branch_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.po_date ? params.data.po_date : 'NA';
      }
    },
    {
      headerName: 'Allocated To',
      field: 'allocation_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueGetter: (params:any) => {
        if (params.data.allocation_type === null || params.data.asset_loc_status =='DEALLOCATED') {
          return 'NA';
        } else if (params.data.allocation_type === 'transfer to other location' && params.data.asset_loc_status =='ALLOCATED') {
          return params.data.allocated_branch;
        } else {
          return params.data.asset_allocated_emp;
        }
      }
    },
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: AssetActionComponent,
    //   cellRendererParams: (params: any) => {
    //     return {
    //       className: 'mat-blue',
    //       hideRequestButton: true,
    //       hideDetailsButton: false,
    //       hideDownloadIcon: false,
    //       showCustomIcon: false,
    //       selectedTab: this.selectedIndex
    //     };
    //   }      
    // }
  ];
  public columnDefs_SD = [
    {
      headerName: '',
      headerCheckboxSelection: true,
      width: 30,
      checkboxSelection: (params: any) => {
        return true;
      },
    },
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 75
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagId',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.asset_tagId ? params.data.asset_tagId : '-----------';
      },
      cellRenderer: this.customCellRenderer.bind(this),

    },
    {
      headerName: 'Serial No',
      field: 'itemSerialNo',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.itemSerialNo ? params.data.itemSerialNo : '-----------';
      }
    },
    {
      headerName: 'Image',
      field: 'image',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      // minHeight: 150,
      cellRenderer: AssetLogoComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Sell Date',
      field: 'disposition_date',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.disposition_date ? params.data.disposition_date : 'NA';
      }
    },
    {
      headerName: 'Write Off Date',
      field: 'discard_date',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.discard_date ? params.data.discard_date : 'NA';
      }
    },
    {
      headerName: 'Disposition Type',
      field: 'disposition_label',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,

    },
    {
      headerName: 'Write Off Method',
      field: 'disposal_method',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.disposal_method ? params.data.disposal_method : 'NA';
      }

    },
    {
      headerName: 'Write Off Reason',
      field: 'discard_reason',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.discard_reason ? params.data.discard_reason : 'NA';
      }

    },
    {
      headerName: 'Sell Price',
      field: 'sell_price',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.sell_price ? params.data.sell_price : 'NA';
      }
    },
    {
      headerName: 'Scrap Value',
      field: 'scrap_value',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.scrap_value ? params.data.scrap_value : 'NA';
      }
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,

    },
    {
      headerName: 'Buyer Name',
      field: 'buyer_name',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.buyer_name ? params.data.buyer_name : 'NA';
      }
    },
    {
      headerName: 'Buyer Contact',
      field: 'buyer_contact',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.buyer_contact ? params.data.buyer_contact : 'NA';
      }
    },
    {
      headerName: 'Buyer Company',
      field: 'buyer_company',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.buyer_company ? params.data.buyer_company : 'NA';
      }
    },
    {
      headerName: 'Profit/Loss',
      field: 'profitOrLoss',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params:any) => {
        return params.data.profitOrLoss ? params.data.profitOrLoss : 'NA';
      }
    },



    {
      headerName: 'Billing Address',
      field: 'branch_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Disposition Note',
      field: 'disposition_note',
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    // {
    //   headerName: 'Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: AssetActionComponent,
    //   cellRendererParams: (params: any) => {
    //     return {
    //       className: 'mat-blue',
    //       hideRequestButton: true,
    //       hideDetailsButton: false,
    //       hideDownloadIcon: false,
    //       showCustomIcon: false,
    //       selectedTab: this.selectedIndex
    //     };
    //   }      
    // }
  ];
  customCellRenderer(params: any) {

    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.color = 'green';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;

  }
  clickIt(params: any) {
    this.route.navigate(['/master/asset-management/asset-list/basic-details'], {
      queryParams: {
        id:params.data?.grn_item_status_id,grn_id:params.data?.grn_id
      }
    })


  }
  openAssetForm(actionType: 'sell' | 'writeoff') {
    const selectedAssets = this.gridApi.getSelectedRows(); 
  
    if (selectedAssets.length === 0) {
      alert("Please select at least one asset.");
      return;
    }
  
    this.dialog.open(AssetSaleWriteoffFormComponent, {
      width: '900px',
      data: {
        assets: selectedAssets,
        actionType: actionType
      }
    });
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    if (this.tabsList[event.index] == 'All Assets') {
      this.getAssetList();
    } else if (this.tabsList[event.index] == 'Sold and Discard Assets') {
      this.getSoldAndDiscardAssets();
    } 
  }
  getSoldAndDiscardAssets(){
    this.asset_service.getAllDisposedAssets().subscribe((res:any)=>{
      if(res.data){
       this.rowData_SD=res.data;
      }
  },(err:any)=>{
    this.rowData_SD=[]
  })
  }

  exportToExcel(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    if (this.rowData_SD.length <= 0) {
     this.toaster.error('Data is not available');
     return
    }
    else if(selectedRows.length > 0){
      this.rowList = selectedRows
    }else{
      this.rowList = this.rowData_SD;
    }
    const exportData = this.rowList.map((emp: any) => ({
      "Asset No.": emp.asset_tagId || 'NA',
      "Serial No.": emp.itemSerialNo || 'NA',
      "Item Name": emp.item_name || 'NA',
      "Sell Date": emp.disposition_date || 'NA',
      "Write Off Date": emp.discard_date || 'NA',
      "Write Off Method": emp.disposal_method || 'NA',
      "Write Off Reason": emp.discard_reason || 'NA',
      "Sell Price": emp.sell_price || 'NA',
      "Scrap Value": emp.scrap_value || 'NA',
      "Total Amount": emp.total_amount || 'NA',
      "Buyer Name": emp.buyer_name || 'NA',
      "Buyer Contact": emp.buyer_contact || 'NA',
      "Buyer Company": emp.buyer_company || 'NA',
      "Profit/Loss": emp.profitOrLoss || 'NA',
      "Billing Address": emp.branch_address || 'NA',
      "Disposition Note": emp.disposition_note || 'NA',
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
       { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 }
    ];
  
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Asset Sold And Discard': worksheet },
      SheetNames: ['Asset Sold And Discard']
    };
  
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'asset_data');
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}

