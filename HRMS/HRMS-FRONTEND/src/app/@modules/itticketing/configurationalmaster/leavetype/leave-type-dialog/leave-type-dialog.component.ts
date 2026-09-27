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
  selector: 'app-leave-type-dialog',
  templateUrl: './leave-type-dialog.component.html',
  styleUrls: ['./leave-type-dialog.component.scss']
})
export class LeaveTypeDialogComponent {
  listLeave: any;
  singleLeave: any;
  leaveTypeform:FormGroup
  constructor(
    private dialog: MatDialogRef<LeaveTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.listLeave = data.id;
    
  }
  addLeave_type:any
  editData:any;
  visible:any;
  ngOnInit() {
    this.editData=this.data.edit;
    this.addLeave_type=this.data.addLeave;
    this.visible=this.data.visible;
    if(this.visible){
      this.getByIdRole();

    }
    if(this.editData){
      this.getByIdRole();
    }
   this.leaveTypeform=this._fb.group({
    leave_type:new FormControl('',[Validators.required,noLeadingSpaces()]),
    is_carry_forward:new FormControl('',Validators.required),
    number_of_leave:new FormControl('',Validators.required),
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
  submitData(data:any)
{
  if(this.leaveTypeform.invalid){
    return
  }
 if(this.listLeave){
  this._configurationalmasterService.editLeave(this.listLeave, data).subscribe(
    (res: any) => {
      if (res.message == "Leave Type is Already Exits!") {
        this.toaster.warning('Leave Type is Already Exits!');
      }
      else {
        this.toaster.success('Leave Type Update Successfully');
        this.reloadCurrentRoute();
        this.dialog.close();
        this.leaveTypeform.reset();
      }
    }, (err: any) => {
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 409) {
        this.toaster.error('Leave Type is Already Exits!');
      } else {
        this.toaster.error('Error in submission!');
      }
    });
 }
 else{
  this._configurationalmasterService .createLeave(data).subscribe(
    (res: any) => {
      if (res.message == "Leave Type is Already Exits!") {
        this.toaster.warning('Leave Type is Already Exits!');
      }
      else {
        this.toaster.success('Leave Type Added Successfully');
        this.reloadCurrentRoute();
        this.dialog.close();
        this.leaveTypeform.reset();
      }
    },
    (err: any) => {
      if (err.status == 400) {
        this.toaster.error('Something went Wrong!');
      } else if (err.status == 201) {
        this.toaster.error('Leave Type is Already Exits!');
      } else {
        this.toaster.error('Error in submission!');
      }
    }
  );
 }
}
  getByIdRole() {
    this._configurationalmasterService
      .getByIdLeave(this.listLeave)
      .subscribe((res: any) => {
        this.singleLeave = res.data;
        this.leaveTypeform.patchValue({
          leave_type:this.singleLeave.leave_type,
          number_of_leave:this.singleLeave.number_of_leave,
          is_carry_forward:this.singleLeave.is_carry_forward==true?"true":"false"
        })
      });
  }
}
