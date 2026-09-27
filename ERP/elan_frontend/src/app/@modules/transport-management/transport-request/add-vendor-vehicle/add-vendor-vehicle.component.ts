import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-add-vendor-vehicle',
  templateUrl: './add-vendor-vehicle.component.html',
  styleUrls: ['./add-vendor-vehicle.component.scss']
})
export class AddVendorVehicleComponent {
  vehicleTypeList: any;
  loginUser: any;
  financial_year_id: any;
  entity_id: any;
  typeStatus: any;
  employee_id: string | null;
 vehicleForm: FormGroup<any>;
  data: any;
  dialogRef: any;
  vehicle_category_id: any;
  emp_id: any;

  constructor(
    private _transport_service: TransportManagementService,
    private toast : ToastrService,
    private dialog1: MatDialogRef<AddVendorVehicleComponent>,
     @Inject(MAT_DIALOG_DATA) public data1: any,
    private fb: FormBuilder,
    private router: Router,
    // private location :Location
  ) {

  }


  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.employee_id = localStorage.getItem('EmpMainId');
    console.warn(this.data1,'data');

    this.get_vehical_category_Active()


    this.vehicleForm = this.fb.group({
    vehicle_category_id: [null, Validators.required],
    vehicle_number: ['', Validators.required],
    rc_number: [''],
    chassis_number: [''],
    engine_number: [''],
    max_load_capacity:[null, Validators.required],
    vehicle_model: [null, Validators.required],
    vehicle_make: [null, Validators.required],
    gps_enabled: [null, Validators.required],
    fuel_type: [null, Validators.required],

  });
  }

  get_vehical_category_Active() {
    this._transport_service.get_vehical_category_Active(this.entity_id,this.financial_year_id
      // this.loginUser?.role,
    ).subscribe(
      (res: any) => {
        console.log('Vehicle Type Response:', res);
        if (res && res.data) {
          this.vehicleTypeList = res.data;
          console.log('Dropdown List:', this.vehicleTypeList);
          console.log(Array.isArray(this.vehicleTypeList));

        }
      },
      (err: any) => {
        console.error('Error fetching vehicle types:', err);
      }
    );
  }



onSubmit(): void {
  this.vehicleForm.markAllAsTouched();

   if (this.vehicleForm.invalid) {
    this.toast.error('Please fill all required fields');
    return;
  }
  const val = {
    ...this.vehicleForm.value,
    entity_id: this.entity_id,
    financial_year_id: this.financial_year_id,
    created_by: this.emp_id,
    vendor_id: this.data1?.id
  };

  console.log('📦 Submitting Payload (No validation check):', val);

  if (!this.vehicle_category_id) {
    this._transport_service.create_vehicle(val).subscribe({
      next: (res: any) => {
        console.log(' Vehicle Created Response:', res);
        if (res) {
          this.toast.success('Vehicle created successfully');
         this.dialog1.close(res.data);

        //  this.reloadCurrentRoute()

        }
      },
      error: (err: any) => {
        console.error('Error creating vehicle:', err);
        this.toast.error('Failed to create vehicle');
      }
    });
  } else {
    console.warn('Update mode logic not implemented');
  }
}
vehicleTypeList2:any=[]
getVehicleByVendor(vendorId: any) {
    this._transport_service.getVehiclesByVendor(vendorId).subscribe({
      next: (res: any) => {
        this.vehicleTypeList2 = res.data;
        console.log('Vehicle List:', this.vehicleTypeList2);
      },
      error: (err: any) => {
        console.error('Failed to load vehicles for vendor', err);
      }
    });
  }

 reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }



goBack() {
  this.dialog1.close();
}




}
