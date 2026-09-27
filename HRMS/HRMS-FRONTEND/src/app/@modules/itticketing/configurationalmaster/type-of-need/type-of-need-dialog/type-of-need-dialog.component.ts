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
  selector: 'app-type-of-need-dialog',
  templateUrl: './type-of-need-dialog.component.html',
  styleUrls: ['./type-of-need-dialog.component.scss']
})
export class TypeOfNeedDialogComponent {
  typeOfNeedForm:FormGroup;
  id: any;
  mode: any;
  getData: any;
  view: any;
  constructor(
    private dialog: MatDialogRef<TypeOfNeedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    
  }
  ngOnInit() {
    console.log(this.data,'datadatadatadata');
    this.id=this.data.id;
    this.view = this.data?.mode
    if(this.id){
      this.getTypeOfNeed();
    }
   this.typeOfNeedForm=this._fb.group({
    need_type:new FormControl('',[Validators.required,noLeadingSpaces()]),
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
    if(this.typeOfNeedForm.invalid){
      return
    }
    if(this.id){
    this._configurationalmasterService.updateTypeOfNeed(this.id, data).subscribe(
      (res: any) => {
        if (res.message == "Type Of Need already exists!") {
          this.toaster.warning('Type Of Need already exists!');
        }
        else {
          this.toaster.success('Type Of Need Update Successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.typeOfNeedForm.reset();
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
        // if (err.status == 400) {
        //   this.toaster.error('Something went Wrong!');
        // } else if (err.status == 409) {
        //   this.toaster.error('Type Of Need already exists!');
        // } else {
        //   this.toaster.error('Error in submission!');
        // }
      });
    }
    else{
      this._configurationalmasterService.createTypeOfNeedMaster(data).subscribe(
        (res: any) => {
          if (res.message == "Type Of Need Already Exits!") {
            this.toaster.warning('Type Of Need already exists!');
          }
          else {
            this.toaster.success('Type Of Need added Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.typeOfNeedForm.reset();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 201) {
          //   this.toaster.error('Type Of Need already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
  }
  getTypeOfNeed() {
    this._configurationalmasterService
      .getTypeOfNeedById(this.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.typeOfNeedForm.patchValue({
          need_type:this.getData.need_type,
        })
    });
  }
}
