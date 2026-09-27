import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-vehical-fuel-type',
  templateUrl: './vehical-fuel-type.component.html',
  styleUrls: ['./vehical-fuel-type.component.scss']
})
export class VehicalFuelTypeComponent {
 
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: number | null;
  financial_year_id: number | null;

  constructor(private toaster: ToastrService,private transport_service:TransportManagementService,
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
      flex: 1,
    },
    {
      headerName: 'Vehicle Fuel Type Name',
      field: 'fuelType',
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
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      cellRenderer: (params: any) => {
        const editIcon = document.createElement('span');
        editIcon.className = 'material-icons';
        editIcon.innerHTML = 'edit';
        editIcon.style.cursor = 'pointer';
        editIcon.style.color = '#00644d';
        editIcon.addEventListener('click', () => {
          this.openFuelSweetAlert(params.data); // ✅ EDIT (with data)
        });
        return editIcon;
      }
    }
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

  getAllData(){
  this.transport_service.getAll_fuelType(this.entity_id).subscribe((res:any)=>{
     if(res){
      this.rowData=res.data;
     }
  },(err:any)=>{

  })
}

openFuelSweetAlert(rowData?: any) {
  const isEdit = !!rowData;
  Swal.fire({
    title: isEdit ? 'Edit Fuel Type' : 'Add Fuel Type',
    html: `
      <input id="fuelType" class="swal2-input"
        value="${isEdit ? rowData.fuelType : ''}"
        placeholder="Fuel Type">

      <input id="fuelDesc" class="swal2-input"
        value="${isEdit ? rowData.description : ''}"
        placeholder="Fuel Description">
    `,
    showCancelButton: true,
    confirmButtonText: isEdit ? 'Update' : 'Save',
    focusConfirm: false,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),

    preConfirm: async () => {
      const fuelType =
        (document.getElementById('fuelType') as HTMLInputElement).value;
      const fuelDesc =
        (document.getElementById('fuelDesc') as HTMLInputElement).value;

      if (!fuelType) {
        Swal.showValidationMessage('Fuel Type is required');
        return false;
      }

      const payload = {
        id: isEdit ? rowData.id : null,
        fuelType,
        description: fuelDesc,
        entity_id: this.entity_id,
        financial_year_id: this.financial_year_id
      };

      try {
        // WAIT till API response
        const res: any = await firstValueFrom(
          this.transport_service.cu_fueltype(payload)
        );

        return res; // success → popup auto close
      } catch (err: any) {
        // API error → popup stays open
        Swal.showValidationMessage(
          err?.error?.message || 'Something went wrong'
        );
        return false;
      }
    }
  }).then(result => {
    if (result.isConfirmed) {
      this.toaster.success(result.value.message);

      // Grid refresh AFTER popup closed
      this.getAllData(); // grid reload function
    }
  });
}

}