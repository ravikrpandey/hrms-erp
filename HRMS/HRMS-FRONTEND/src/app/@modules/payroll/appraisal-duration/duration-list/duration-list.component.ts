import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { DurationCreateComponent } from '../duration-create/duration-create.component';
import { DurationToggleComponent } from '../duration-toggle/duration-toggle.component';
import { ActionDurationComponent } from '../action-duration/action-duration.component';
// import { TaxSlabActionComponent } from '../tax-slab-action/tax-slab-action.component';
// import { TaxSlabToggleComponent } from '../tax-slab-toggle/tax-slab-toggle.component';

@Component({
  selector: 'app-duration-list',
  templateUrl: './duration-list.component.html',
  styleUrls: ['./duration-list.component.scss']
})
export class DurationListComponent {
    rowClass: any;
    private gridApi!: GridApi<any>;
    rowData: any;
  
    constructor(
      public dialog: MatDialog,
      private router: Router,
      private payrollService:PayrollService,
      private toast:ToastrService
    ) {
      this.rowClass = 'rowClass';
    }
    // ngOnInit(): void {
    //   // this.getAllCreatedTaxslabList()
    // }
  

    ngOnInit():void {
      this.getAllAppraisalDuration()
    }
  
    getAllAppraisalDuration(){
      this.payrollService.getAllAppraisalDuration().subscribe((res :any) =>{
      this.rowData = res.data;
        
        
      },
      ((err:any)=>{
        this.toast.error(`${err.error?.message}`)
        this.rowData=[];
      })
      )
    }
    
  
    getAllCreatedTaxslabList() {
      this.payrollService.getAllCreatedTaxslabList().subscribe((res: any) => {
        this.rowData=res.data
      }, (err:any) => {
        this.toast.error(err.error.message);
      });
    }
    
  
  
  
    public columnDefs = [
      {
        headerName: 'S No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Period',
        field: 'period',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Effective After',
        field: 'effective_after',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
  
    
      {
        field: 'status',
        headerName: 'Status',
        cellRenderer: DurationToggleComponent,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
     
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 120,
        cellRenderer: ActionDurationComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
        cellClass: 'grid-cell-centered',
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
  
  
    onCellClicked(e: any) {
  
    }

    onSubmit = () => {
        const dialogRef = this.dialog.open(DurationCreateComponent, { width: '700px',});
         dialogRef.afterClosed().subscribe(result => {
           
         })
        
         }
  
  }
