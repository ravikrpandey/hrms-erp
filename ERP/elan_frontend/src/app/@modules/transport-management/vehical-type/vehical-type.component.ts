import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehical-type',
  templateUrl: './vehical-type.component.html',
  styleUrls: ['./vehical-type.component.scss']
})
export class VehicalTypeComponent {
 
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: number | null;
  financial_year_id: number | null;

  constructor(
    private route: Router,
    private toast: ToastrService,private transport_service:TransportManagementService,
    private accessData: AccessControlService
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
      flex: .7,
    },
    {
      headerName: 'Vehicle Type Name',
      field: 'vehicle_type_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.5,
    },
    {
      headerName: 'Vehicle Category',
      field: 'vehical_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Body Type',
      field: 'body_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Axle Type',
      field: 'axle_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Length',
      field: 'length_ft',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Width',
      field: 'width_ft',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Height',
      field: 'height_ft',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'vehicle_type_id',
      flex: 1,
      cellRenderer: (params: any) => {
        return `
          <span class="action-icons" style="color: #00644d !important; cursor:pointer">
            <i class="material-icons edit" title="Edit">edit</i>
            <i class="material-icons view" title="View">visibility</i>
            <i class="material-icons delete" title="Delete">delete</i>
          </span>
        `;
      },
      onCellClicked: (params: any) => {
        const target = params.event.target;

        if (target.classList.contains('edit')) {
          this.OnClick(params.data.vehicle_type_id,'CreateUpdate');
        }

        if (target.classList.contains('view')) {
          this.OnClick(params.data.vehicle_type_id,'View');
        }

        if (target.classList.contains('delete')) {
          this.onDelete(params.data.vehicle_type_id);
        }
      }
    }
  ];

  onDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          this.transport_service.deleteVehicleType(id).subscribe(
            (res: any) => {
              this.toast.success(res.message);
              this.getAllData(); // grid refresh
              resolve(res); // ✅ popup close
            },
            (err: any) => {
              this.toast.error(err.error?.message || 'Delete failed');
              Swal.showValidationMessage(
                err.error?.message || 'Something went wrong'
              );
              reject(); // ❌ popup stays open
            }
          );
        });
      }
    });
  }

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

  getAllData(){
    this.transport_service.getAll_vehicleType(this.entity_id).subscribe((res:any)=>{
      if(res){
        this.rowData=res.data;
      }
    },(err:any)=>{

    })
  }

  OnClick(id:any, actionType: any){
    this.route.navigate(['/master/transport-management/create-vehicle-type'],{ queryParams: { vehicleType_id: id, actionType: actionType } });
  }

}