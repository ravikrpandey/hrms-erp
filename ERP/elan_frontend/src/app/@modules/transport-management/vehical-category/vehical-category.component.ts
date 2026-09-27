import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { CreateVehicalCategoryComponent } from './create-vehical-category/create-vehical-category.component';
import { VehicalCategoryStatsuComponent } from './vehical-category-statsu/vehical-category-statsu.component';
import { VehicalCategoryActionComponent } from './vehical-category-action/vehical-category-action.component';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-vehical-category',
  templateUrl: './vehical-category.component.html',
  styleUrls: ['./vehical-category.component.scss']
})
export class VehicalCategoryComponent {
  
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: number | null;
  financial_year_id: number | null;

  constructor(private accessData: AccessControlService,
    public dialog: MatDialog, private route: Router,private transport_service:TransportManagementService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.getAllData();
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {

      headerName: 'Vehicle Category Name',
      field: 'vehical_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Status',
    //   field: 'id',
    //   flex: 1,
    //   cellRenderer: VehicalCategoryStatsuComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false, // Hide attachment icon
    //   },
    // },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      cellRenderer: VehicalCategoryActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  openDialog(e: any) {
     e.stopPropagation()
     const dialogRef
       = this.dialog.open(CreateVehicalCategoryComponent, {
         width: '30%',
         data: { data: '' }
       });

     dialogRef.afterClosed().subscribe((result:any) => {
     });
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

  onCellValueChanged(event: CellValueChangedEvent) {

  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  getAllData(){
    this.transport_service.getAll_vehical_category(this.entity_id,this.financial_year_id).subscribe((res:any)=>{
      if(res){
        this.rowData=res.data;
      }
    },(err:any)=>{

    })
  }

}