import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { AllPrActionComponent } from '../../../purchase-inventory/purchase-request/all-pr/all-pr-action/all-pr-action.component';
// import { PrStatusDilogComponent } from '../../../purchase-inventory/purchase-request/all-pr/pr-status-dilog/pr-status-dilog.component';

@Component({
  selector: 'app-approval-level-list',
  templateUrl: './approval-level-list.component.html',
  styleUrls: ['./approval-level-list.component.scss']
})
export class ApprovalLevelListComponent {
    quickFilter: string;
    rowClass: any;
    private gridApi!: GridApi<any>;
    depData: any;
    catData: any;
    // assignAction:any;
    filteredData:any
  
    constructor(
     private route: Router,
     private toast: ToastrService,
     private activeroute: ActivatedRoute,
     public dialog: MatDialog, 
     private configService:ConfigurationalmasterService,
     private prService: PurchaseRequestService,
     ) {
     this.rowClass = 'rowClass';
   }
  
   ngOnInit(): void {
    this.configService.getDepartment().subscribe((res:any)=>{
      this.depData = res.data;
    })
  
    this.getAllPr();
    this.getAllCategory();
  }
  
  ngAfterViewInit(): void {

  }
  
    public rowData:any;
  
    public columnDefs = [
      {
        headerName: 'Sr No.',
        field: 'procurement_product_id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'PR NO',
        field: 'procurement_id',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Department',
        field: 'department',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Create Date',
        field: 'createdAt',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex:1,
        minWidth:150,
        valueFormatter:(params:any)=>{
          return moment(new Date(params.value)).format('LL')
        },
      },
      {
        headerName: 'Asset Category',
        field: 'item_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Amount',
        field: 'mvp',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Status',
        field: 'approvel_status',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Priority',
        field: 'priority',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        valueFormatter: 'JSON.parse(value)',
        flex:1,
        minWidth:150,
      },
      {
        headerName: 'Actions',
        field: 'procurement_product_id', sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        flex:1,
        minWidth:150,
        // cellRenderer: AllPrActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, 
        },
        cellClass: "grid-cell-centered",
       
      },
      
    ];
  
  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      
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
  
    onFilterByDepartment(event:any) {
      if (event == null || undefined){
        this.filteredData  = this.rowData;
      }else{
        this.filteredData  = this.rowData.filter((res:any) => res.department == event);
      } 
    }
  
    onFilterAssetCategory(event:any){
      if (event == null || undefined){
        this.filteredData  = this.rowData;
      }else{
        this.filteredData  = this.rowData.filter((res:any) => res.asset_category_id == event);
      } 
    }
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
  
    statusCellClicked(e:any){
        // const dialogRef = this.dialog.open(PrStatusDilogComponent, { width: '400px', data: e.data});
        // dialogRef.afterClosed().subscribe(result => {
        // })
    }
  
    getAllPr(){
      let idEmp:any=localStorage.getItem('EmpMainId')
      let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    
    const data={
      loggedUserRole: loginUser.role
    }
      this.prService.getAllPrList(idEmp,data).subscribe((res:any)=>{
        this.rowData= res.data;
        this.filteredData  = this.rowData;
      })
    }
  
    getAllCategory() {
      this.prService.getAllCategory().subscribe((res: any) => {
        this.catData = res.data;
        
      })
    }
  
}
