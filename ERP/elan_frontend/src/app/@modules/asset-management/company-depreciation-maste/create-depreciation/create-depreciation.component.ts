import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { Depreciation } from './depreciation';
import { IdEncoderService } from 'src/app/@shared/services/id-encoder.service';


@Component({
  selector: 'app-create-depreciation',
  templateUrl: './create-depreciation.component.html',
  styleUrls: ['./create-depreciation.component.scss']
})
export class CreateDepreciationComponent implements OnInit {
  getCat_data: any;
  selectedFrequency: string = 'Yearly';
  calculateData: any;
  id: any;
  createDepreciationForm: FormGroup;
  emp_id: any;
  entity_id: string | null;
  filter_fy: string | null;
  mode: any;
  depreciation: Depreciation;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private depreciationService: DepreciationService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private idEncoder: IdEncoderService
  ) {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params?.id ? this.idEncoder.decodeId(params.id) : null;
      this.mode = params.mode;
    });
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.emp_id = loginUser?.employee_id
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');
    this.createForm();
    this.getAllAssetCategory();
    this.getCalculationMethods();
    if (this.id) {
      this.getDepreciationById();
    }
    //  if(this.mode=='view'){
    //   this.createDepreciationForm.disable();
    //  }
  }

  createForm() {
    this.createDepreciationForm = this.fb.group({
      asset_id: new FormControl(null, [Validators.required]),
      calculation_id: new FormControl(null, [Validators.required]),
      salvage_value: new FormControl(null, [Validators.required]),
      frequency: new FormControl('Yearly', [Validators.required]),
      use_full_life: new FormControl(null, [Validators.required]),
      entity_id: new FormControl(this.entity_id),
    })
  }
  getAllAssetCategory() {
    this._configurationalMasterService.getActiveAssetMasterList().subscribe((res: any) => {
      this.getCat_data = res.data;
    }, (err: any) => {

    })
  }

  getCalculationMethods() {
    this.depreciationService.getCalculationMethods().subscribe((res: any) => {
      this.calculateData = res.data;
    }, (err: any) => {

    })
  }

  onSubmit() {
    if (this.createDepreciationForm.invalid) {
      this.toastr.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    else {
      this.depreciation = {
        asset_id: this.createDepreciationForm.get('asset_id')?.value,
        calculation_id: this.createDepreciationForm.get('calculation_id')?.value,
        salvage_value: this.createDepreciationForm.get('salvage_value')?.value,
        frequency: this.createDepreciationForm.get('frequency')?.value,
        use_full_life: this.createDepreciationForm.get('use_full_life')?.value,
        entity_id: this.entity_id,
      }
      if (this.id) {
        this.depreciationService.updateDepreciationCalculations(this.depreciation, this.id).subscribe((res: any) => {
          this.toastr.success('Depreciation Update Successfully')
          this.router.navigate(['/master/asset-management/depreciation-master'])
        }, (err: any) => {
          this.toastr.error(err.error.message)
        })
      }
      else {
        this.depreciationService.createDepreciationCalculations(this.depreciation).subscribe((res: any) => {
          this.toastr.success('Depreciation Create Successfully')
          this.router.navigate(['/master/asset-management/depreciation-master'])
        }, (err: any) => {
          this.toastr.error(err.error.message)
        })
      }

    }
  }
  getDepreciationById() {
    this.depreciationService.getDepreciationCalculationsById(this.id, this.entity_id).subscribe((res: any) => {
      if (res.data) {
        this.Patchformdata(res.data[0]);
      }
    }, (err: any) => {

    })
  }

  Patchformdata(data: any) {

    if (data) {
      this.createDepreciationForm.patchValue({
        asset_id: Number(data?.asset_id),
        calculation_id: data?.calculation_id,
        salvage_value: data?.salvage_value,
        frequency: data?.frequency,
        use_full_life: data?.use_full_life,
      })
    }
  }
}
