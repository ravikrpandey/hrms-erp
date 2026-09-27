import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {

  vehicleTypeList: any;
  typeStatus: any;
  vehicleForm!: FormGroup;
  vehicleTypeList2: any;
  vehicle_id: any;
  status: any;

  constructor(
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private _transport_service: TransportManagementService,
    @Inject(MAT_DIALOG_DATA) public data1: any,
  ) {
    // Initialize your form controls here, add more fields as needed
    this.vehicleForm = this.fb.group({
      vehicle_category_id: [''],
      vehicle_number: [''],
      rc_number: [''],
      chassis_number: [''],
      engine_number: [''],
      max_load_capacity: [''],
      vehicle_model: [''],
      vehicle_make: [''],
      gps_enabled: [''],
      fuel_type: ['']
      // Add other form controls as required
    });
  }

  ngOnInit() {

    let financial_id = localStorage.getItem('financial_id')
    let entity_id = localStorage.getItem('selectedEntityId')
    this.get_vehicle_master_byId();
    this.get_vehical_category_Active(entity_id, financial_id);
    this.activeroute.queryParams.subscribe((params: any) => {
      let id = params?.id;
      this.vehicle_id = id;
      this.status = params.status;




    });


    console.warn(this.data1, 'fsfhka');

  }

  get_vehicle_master_byId() {
    this._transport_service.get_vehicle_master_byId(this.data1).subscribe({
      next: (res: any) => {
        if (res) {
          let data = res?.data[0];
          if (data) {
            this.vehicleForm.patchValue(data);
          }
        }
      },
      error: (err: any) => {
        console.error('Error fetching vehicle data', err);
      }
    });
  }

  get_vehical_category_Active(a: any, b: any) {
    this._transport_service.get_vehical_category_Active(a, b).subscribe(
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

  goBack() {
    window.history.back();
  }

  onSubmit() {
    // Implement submit logic if needed, else remove this method
  }

}
