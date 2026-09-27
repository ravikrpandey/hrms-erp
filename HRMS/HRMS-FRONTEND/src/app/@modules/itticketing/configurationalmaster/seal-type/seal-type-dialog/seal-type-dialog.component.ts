import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { A } from '@fullcalendar/core/internal-common';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-seal-type-dialog',
  templateUrl: './seal-type-dialog.component.html',
  styleUrls: ['./seal-type-dialog.component.scss']
})
export class SealTypeDialogComponent {
  id : any;
  sealTypeForm:FormGroup;
  mode: any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<SealTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService : FinaceService,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode;
    this.sealTypeForm=this._fb.group({
      seal_type:new FormControl('',[Validators.required,noLeadingSpaces()]),
    })
  }

  ngOnInit() {
    if(this.id){
      this.getSealTypeById();
    }
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
    if(this.sealTypeForm.invalid){
      return
    }
    if(this.id){
      this._configurationalmasterService.updateSealType(this.id, data).subscribe(
        (res: any) => {
          this.toaster.success('Seal Type update successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.sealTypeForm.reset();
        }, (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 409) {
          //   this.toaster.error('Leave Type is Already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
    else{
      console.log("Fdfd")
      this._configurationalmasterService.createSealTypeMaster(data).subscribe(
        (res: any) => {
          this.toaster.success('Seal Type added successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.sealTypeForm.reset();
        },
          (err: any) => {
            this.toaster.error(err.error.message)
            // if (err.status == 400) {
            //   this.toaster.error('Something went Wrong!');
            // } else if (err.status == 201) {
            //   this.toaster.error('Budget Category already Exits!');
            // } else {
            //   this.toaster.error('Error in submission!');
            // }
          }
        );
      }
  }
  getSealTypeById() {
    this._configurationalmasterService
      .getSealTypeById(this.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.sealTypeForm.patchValue({
          seal_type:this.getData.seal_type,
        })
      });
  }
}
