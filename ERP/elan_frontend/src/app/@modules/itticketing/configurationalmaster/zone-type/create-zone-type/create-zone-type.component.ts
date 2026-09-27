import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-create-zone-type',
  templateUrl: './create-zone-type.component.html',
  styleUrls: ['./create-zone-type.component.scss']
})
export class CreateZoneTypeComponent {

  createForm!: FormGroup;
  id: any;
  action_type: any;

  constructor(
    private fb: FormBuilder,
    private _configService: ConfigurationalmasterService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private _commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      zone_type: ['', Validators.required]
    });

    this.activeRoute.queryParams.subscribe(params => {
      this.id = params['id'];
      this.action_type = params['action_type'];

      if (this.id) this.getById(this.id);
    });
  }

  getById(id: any) {
    this._commonService.showLoader();
    this._configService.zoneTypeById(id).subscribe(
      (res: any) => {
        this._commonService.hideLoader();
        this.createForm.patchValue({
          zone_type: res.data.zone_type
        });
      },
      (err) => {
        this._commonService.hideLoader();
        this.toastr.error(err.error.message);
      }
    );
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.toastr.error("Sub Location Type is required");
      return;
    }

    const payload = { zone_type: this.createForm.value.zone_type };

    if (!this.id) {
      this._commonService.showLoader();
      this._configService.createZoneType(payload).subscribe(
        (res: any) => {
          this._commonService.hideLoader();
          this.toastr.success(res.message);
          this.route.navigate(["/master/configurational-master/zone-type-master"]);
        },
        (err) => {
          this._commonService.hideLoader();
          this.toastr.error(err.error.message);
        }
      );

    } else {
      this._commonService.showLoader();
      this._configService.updateZoneType(this.id, payload).subscribe(
        (res: any) => {
          this._commonService.hideLoader();
          this.toastr.success(res.message);
          this.route.navigate(["/master/configurational-master/zone-type-master"]);
        },
        (err) => {
          this._commonService.hideLoader();
          this.toastr.error(err.error.message);
        }
      );
    }
  }

  onBack() {
    this.route.navigate(["/master/configurational-master/zone-type-master"]);
  }

}
