import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray,FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { ProductionService } from 'src/app/@shared/services/production/production.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-quality-create',
  templateUrl: './quality-create.component.html',
  styleUrls: ['./quality-create.component.scss']
})
export class QualityCreateComponent {
  AddNewForm: FormGroup;
  getAllProductData: any;
  getAllWorkStationData: any;
  viewDetails: any;
  qualityId: any
  parm: any;
  getData: any;
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private activetedRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private route: Router
  ) {
    this.AddNewForm = _fb.group({
      work_station_id: new FormControl(null, Validators.required),
      product_master_id: new FormControl(null, Validators.required),
      product_variant_name: new FormControl(null, Validators.required),
      quality_parameter_detail: new FormArray([
        new FormGroup({
          quality_parameter: new FormControl(null, [Validators.required,noLeadingSpaces()]),
          value: new FormControl(null, [Validators.required,noLeadingSpaces()]),
        }),
      ]),
    })

  }
  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.qualityId = params.id;
      this.viewDetails = params.view
      
    })
    this.getAllProduct();
    this.getAllActiveWorkStation();
    if (this.qualityId) {
      this.getQualityById();
    }
  }

  getQualityById() {
    while (this.itemsFormArray.quality_parameter_detail.length > 0) {
      this.itemsFormArray.quality_parameter_detail.removeAt(0);
    }
    this._configurationalMasterService.getQualityById(this.qualityId).subscribe((res: any) => {
      this.getData = res.data;
      this.getProductItem(this.getData.product_master_id);
      this.AddNewForm.patchValue({
        work_station_id: this.getData.work_station_id,
        product_master_id: this.getData.product_master_id,
        product_variant_name: this.getData.product_variant_name,
        quality_parameter_detail: this.getData.quality_parameters,
      })
      const qualityParameterArray = this.AddNewForm.get('quality_parameter_detail') as FormArray;
      this.getData?.quality_parameters.forEach((quality: any) => {
        const newRow = this._fb.group({
          quality_parameter: quality.quality_parameter,
          value: quality.value,
        });
        qualityParameterArray.push(newRow);
      });
    })
  }
  getAllProduct() {
    this._configurationalMasterService.getProductMasterList().subscribe((res: any) => {
      this.getAllProductData = res.data
    })
  }
  getAllActiveWorkStation() {
    this._configurationalMasterService.getActiveWorkStationMasterList().subscribe((res: any) => {
      this.getAllWorkStationData = res.data
    })
  }

  getProductVariant: any[] = []
  getProductItem(id: any) {
    this.getProductVariant = []
    this._configurationalMasterService.getActiveVariantByProductId(id).subscribe((res: any) => {
      this.getProductVariant = res.data;
    })

  }

  goBack() {
    this.location.back();
  }
  get itemsFormArray(): any {
    return this.AddNewForm.controls;
  }
  addItem() {
    const parameterArray = this.itemsFormArray.quality_parameter_detail as FormArray
    let data = this._fb.group({
      quality_parameter: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      value: new FormControl(null, Validators.required),
    });
    parameterArray.push(data);
  }

  removeItem(index: number): void {
    this.itemsFormArray.quality_parameter_detail.removeAt(index);
  }

  ngSubmitQuality() {
    let val = this.AddNewForm.value;
    if (this.AddNewForm.invalid) {
      this.toaster.error('required fields should not be blank', 'Required fields');
      return
    }
    if (this.qualityId) {
      this._configurationalMasterService.updateQualityById(this.qualityId, val).subscribe((res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.route.navigate(['/master/configurational-master/quality-master'])
          this.AddNewForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }
    else {
      this._configurationalMasterService.createQuality(val).subscribe((response: any) => {
        if (response) {
          this.toaster.success(response.message)
          this.route.navigate(['/master/configurational-master/quality-master'])
          this.AddNewForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }
  }
}
