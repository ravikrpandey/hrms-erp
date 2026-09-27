import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-region-dialog',
  templateUrl: './region-dialog.component.html',
  styleUrls: ['./region-dialog.component.scss']
})
export class RegionDialogComponent {

  regionForm:FormGroup;
  id:any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<RegionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode;
  }
  mode:any;
  ngOnInit() {
    if(this.id){
      this.getByIdRole();
    }
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.regionForm=this._fb.group({
      region_name:new FormControl('',[Validators.required,noLeadingSpaces()]),
      region_code:new FormControl('',[Validators.required,noLeadingSpaces()]),
    })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  getVal(event:any){
  }
  submitData(data:any){
    if(this.regionForm.invalid){
      return
    }
    if(this.id){
    this._configurationalmasterService.editRegion(this.id, data,this.entity_id).subscribe(
      (res: any) => {
        if (res.message == "Region Already Exists!") {
          this.toaster.warning('Region Already Exists!');
        }
        else {
          this.toaster.success('Region Update Successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.regionForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        // if (err.status == 400) {
        //   this.toaster.error('Something went Wrong!');
        // } else if (err.status == 409) {
        //   this.toaster.error('Region Already Exists!');
        // } else {
        //   this.toaster.error('Error in submission!');
        // }
      });
    }
    else{
      this._configurationalmasterService.createRegionMaster(data,this.entity_id).subscribe(
        (res: any) => {
          if (res.message == "Leave Type is Already Exits!") {
            this.toaster.warning('Region Already Exits!');
          }
          else {
            this.toaster.success('Region Added Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.regionForm.reset();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 201) {
          //   this.toaster.error('Region Already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
  }
  getByIdRole() {
    this._configurationalmasterService.getRegionById(this.id).subscribe((res: any) => {
      this.getData = res.data;
      this.regionForm.patchValue({
        region_name:this.getData.region_name,
        region_code:this.getData.region_code,
      })
    });
  }
}
