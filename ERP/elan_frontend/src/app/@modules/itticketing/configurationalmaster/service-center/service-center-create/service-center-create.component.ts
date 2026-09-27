import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-service-center-create',
  templateUrl: './service-center-create.component.html',
  styleUrls: ['./service-center-create.component.scss']
})
export class ServiceCenterCreateComponent {
  servicecenterForm: FormGroup;
  candidate_id: any;
  singleItem: any;
  readable: boolean = false;
  id: any;
  role: any;
  alldata: any;
  createdata: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private $common: CommonService,
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    this.servicecenterForm = this.fb.group({
      sc_contact_no: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      sc_email: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
      sc_code: new FormControl('', [Validators.required]),
      sc_name: new FormControl('', [Validators.required]),
      sc_gst_no: new FormControl('', [Validators.required]),
      contact_person: new FormControl('', [Validators.required]),
      sc_address: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activeRoute.queryParamMap.subscribe((param: any) => {
      this.id = param.params.id
      this.role = param.params.role;
      if (this.role == 'view') {
        this.readable = true;
      } else {
        this.readable = false;
      }
    });
    if (this.id) {
      this.getByIdServicecenterMaster();
    }
  }
  getByIdServicecenterMaster() {
    this._configurationalMasterService.getByIdServicecenterMaster(this.id).subscribe((res: any) => {
      this.alldata = res.data;
      this.servicecenterForm.patchValue({
        sc_contact_no: this.alldata?.sc_contact_no,
        sc_code: this.alldata?.sc_code,
        sc_name: this.alldata?.sc_name,
        sc_gst_no: this.alldata?.sc_gst_no,
        sc_address: this.alldata?.sc_address,
        contact_person: this.alldata?.contact_person,
        sc_email: this.alldata?.sc_email
      })
    })
  }

  savecenter() {
    this.servicecenterForm.markAllAsTouched();
    if (this.servicecenterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let val = this.servicecenterForm.value;
    const data: any = {
      sc_contact_no: val.sc_contact_no,
      sc_code: val.sc_code,
      sc_name: val.sc_name,
      sc_gst_no: val.sc_gst_no,
      sc_address: val.sc_address,
      contact_person: val.contact_person,
      sc_email: val.sc_email,
      entity_id :  localStorage.getItem("selectedEntityId")
    }
    if (this.id) {
      this._configurationalMasterService.updateServicecenterMaster(this.id, data).subscribe((res: any) => {

        this.toaster.success(res.message);
        this.router.navigate(['master/configurational-master/service-center']);
      }, err => {
        this.toaster.error(err.error.message)
      })
    } else {

      this._configurationalMasterService.createServicecenterMaster(data).subscribe((res: any) => {
        this.createdata = res.data
        if (res.code == 200) {
          this.toaster.success(res.message);
          this.router.navigate(['master/configurational-master/service-center']);
        }
      }, err => {
        this.toaster.error(err.error.message)
      })
    }

  }
  goBack() {
    this.location.back();
  }
  cancel() {
    this.router.navigate(['master/configurational-master/service-center'])
  }
}
