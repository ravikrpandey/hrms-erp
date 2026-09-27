import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { PurchaseMasterService } from '../../services/purchase-master.service';

@Component({
  selector: 'app-port-master-form',
  templateUrl: './port-master-form.component.html',
  styleUrls: ['./port-master-form.component.scss'],
})
export class PortMasterFormComponent implements OnInit {
  form: FormGroup;
  id: string;
  mode: string;
  portTypes: any[] = [
    'Sea',
    'Air',
    'River',
    'Rail',
    'Road',
    // 'Inland',
    //  "Multimodal Port"
  ];

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: PurchaseMasterService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      id: [null],
      port_name: [null, [Validators.required]],
      unlocode: [null, [Validators.required]],
      port_type: ['Seaport', [Validators.required]],
      latitude: [null],
      longitude: [null],
      country_id: [null, [Validators.required]],
      state_id: [null, [Validators.required]],
      city_id: [null, [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
    });
    this.getAllCountry();
  }

  ngOnInit(): void {
    this.setValueChanges(this.form);
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
      }
      if (this.id) {
        this.loadData();
      }
    });
  }

  setValueChanges(formGroup: FormGroup): void {
    formGroup.get('country_id')?.valueChanges.subscribe((countryId) => {
      if (countryId) {
        this.getAllState(countryId);
      } else {
        this.stateList = [];
      }
    });
    formGroup.get('state_id')?.valueChanges.subscribe((stateId) => {
      if (stateId) {
        this.getAllCity(stateId);
      } else {
        this.cityList = [];
      }
    });
  }

  loadData(): void {
    this.service.getPortById(this.id).subscribe(
      (data: any) => {
        if (data) {
          this.form.patchValue({
            port_name: data.port_name,
            unlocode: data.unlocode,
            port_type: data.port_type,
            latitude: data.latitude,
            longitude: data.longitude,
            country_id: data.country_id,
            state_id: data.state_id,
            city_id: data.city_id,
            status: data.status,
            id: data.id,
          });
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching Travel Type:', error);
        this.toast.error('Failed to load Travel Type details');
      },
    );
  }

  onSubmit(): void {
    console.log('Form Value:', this.form.value);

    if (this.form.valid) {
      if (this.mode === 'edit') {
        this.form.value.id = this.id;

        this.service.updatePort(this.id, this.form.value).subscribe(
          (response) => {
            this.router.navigate([
              'master/configurational-master/purchase-masters/ports',
            ]);
            this.toast.success('Port updated successfully');

            this.form.reset();
          },
          (error) => {
            this.form.reset();
            console.error('Error adding Travel Budget:', error);
          },
        );
      }
      this.service.createPort(this.form.value).subscribe(
        (response) => {
          this.router.navigate([
            'master/configurational-master/purchase-masters/ports',
          ]);
          this.toast.success('Port added successfully');

          this.form.reset();
        },
        (error) => {
          this.form.reset();
          console.error('Error adding Travel Budget:', error);
        },
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe((res: any) => {
      if (res) {
        this.countryList = res.data;
      }
    });
  }

  getAllState(countryId: any) {
    this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
      if (res && res?.data) {
        this.stateList = res?.data;
      }
    });
  }

  getAllCity(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.cityList = res.data;
        }
      },
      error: (err) => {
        console.error('❌ Error fetching cities:', err);
      },
    });
  }
}
