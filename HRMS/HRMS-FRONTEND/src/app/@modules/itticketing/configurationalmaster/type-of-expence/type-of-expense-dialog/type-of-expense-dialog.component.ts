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
  selector: 'app-type-of-expense-dialog',
  templateUrl: './type-of-expense-dialog.component.html',
  styleUrls: ['./type-of-expense-dialog.component.scss']
})
export class TypeOfExpenseDialogComponent {
  mode: any;
  getData: any;
  id : any;
  typeOfExpenseForm : any;
  constructor(
    private dialog: MatDialogRef<TypeOfExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode
  }
  ngOnInit() {
    if(this.id){
      this.getExpenseType();
    }
   this.typeOfExpenseForm=this._fb.group({
    expense_type:new FormControl('',[Validators.required,noLeadingSpaces()]),
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
    if(this.typeOfExpenseForm.invalid){
      return
    }
    if(this.id){
      this._configurationalmasterService.updateTypeOfExpenseCategory(this.id, data).subscribe(
        (res: any) => {
          this.toaster.success('Type Of Expense Update Successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.typeOfExpenseForm.reset();
        }, (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 409) {
          //   this.toaster.error('Type Of Expense already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        });
    }
    else{
      this._configurationalmasterService.createTypeOfExpenseMaster(data).subscribe(
        (res: any) => {
          this.toaster.success('Type Of Expense Added Successfully');
          this.reloadCurrentRoute();
          this.dialog.close();
          this.typeOfExpenseForm.reset();
        },
        (err: any) => {
          this.toaster.error(err.error.message)
          // if (err.status == 400) {
          //   this.toaster.error('Something went Wrong!');
          // } else if (err.status == 201) {
          //   this.toaster.error('Type Of Expense Already Exits!');
          // } else {
          //   this.toaster.error('Error in submission!');
          // }
        }
      );
    }
  }
  getExpenseType() {
    this._configurationalmasterService
      .getTypeOfExpenseById(this.id)
      .subscribe((res: any) => {
        this.getData = res.data;
        this.typeOfExpenseForm.patchValue({
          expense_type:this.getData.expense_type,
        })
      });
  }
}
