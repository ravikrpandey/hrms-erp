import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-mapping',
  templateUrl: './create-mapping.component.html',
  styleUrls: ['./create-mapping.component.scss']
})
export class CreateMappingComponent {
  createform: FormGroup;
  entity_id: Number | null;
  financial_year_id: Number | null;
  getDriverList: any[] = [];
  getVehicleList: any[] = [];
  mappedDrivers: any[] = [];
  mappedVehicles: any[] = [];
  transporter_id: any;
  actionType: any;
  
  constructor(
    private accessData: AccessControlService,
    private toast: ToastrService,
    private router: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private transport_service:TransportManagementService

  ) {
    this.createform = this.fb.group({
      drivers_id: [[]],
      vehicles_id: [[]],
    });
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.router.queryParams.subscribe((params: any) => {
      this.transporter_id = params.id;
      this.actionType = params.actionType;
      if (this.transporter_id) {
        this.getDriversList();
        this.getVehiclesList();
        this.getMapDriversVehiclesList();
      }
    });
  }

  getDriversList() {
    this.transport_service.getAllDriverListUnlinked(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.getDriverList = res.data.map((row: any) => {
          row.label = row.full_name + " [" + row.driver_code + "]";
          return row;
        });
      } else {
        this.getDriverList = [];
      }
    });
  }

  getVehiclesList() {
    this.transport_service.getAllVehicleListUnlinked(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.getVehicleList = res.data;
      } else {
        this.getVehicleList = [];
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.createform.value.drivers_id.length==0 && this.createform.value.vehicles_id.length==0) {
      this.toast.error('Please select at least one option: Driver or Vehicle.');
      return;
    }

    const payload = {
      transporter_id: this.transporter_id,
      driver_id: this.createform.value.drivers_id,
      vehicle_id: this.createform.value.vehicles_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id
    };

    this.transport_service.createDriverVehicleMapping(payload).subscribe((res:any)=>{
      if(res){
        this.toast.success(res.message);
        setTimeout(() => {
          this.goBack();
        }, 2000); // time in milliseconds
      }
    },(err:any)=>{
      this.toast.error(err.error.message);
    })
  }

  getMapDriversVehiclesList() {
    this.transport_service.getAllDriverVehicleMappingList(this.transporter_id).subscribe((res: any) => {
      if (res && res.data) {
        this.mappedDrivers = res.data.drivers;
        this.mappedVehicles = res.data.vehicles;
      } else {
        this.mappedDrivers = [];
        this.mappedVehicles = [];
      }
    });
  }

  delinkDriverVehicle(id: number, type: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delink this ${type}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delink',
      cancelButtonText: 'Cancel'
    }).then((result) => {

    // ✅ Only if user clicks YES
    if (result.isConfirmed) {

      const payload = { id: id, type: type };

      this.transport_service.delinkDriverVehicleMapping(payload)
        .subscribe((res: any) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res.message,
              timer: 1500,
              showConfirmButton: false
            });

            setTimeout(() => {
              this.goBack();
            }, 1500);
          }
        }, (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Something went wrong'
          });
        });
      }
    });
  }

}