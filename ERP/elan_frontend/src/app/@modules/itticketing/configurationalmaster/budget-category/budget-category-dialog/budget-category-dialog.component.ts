import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { A } from '@fullcalendar/core/internal-common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
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
  selector: 'app-budget-category-dialog',
  templateUrl: './budget-category-dialog.component.html',
  styleUrls: ['./budget-category-dialog.component.scss']
})
export class BudgetCategoryDialogComponent {
  id : any;
  budgetCategoryForm:FormGroup;
  mode: any;
  getData: any;
  entity_id: any;
  constructor(
    private dialog: MatDialogRef<BudgetCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private financeService : FinaceService,
    private _commonService : CommonService,
    private _configurationalmasterService: ConfigurationalmasterService,private _fb:FormBuilder,private route:Router,private toaster:ToastrService
  ) {
    this.id = data.id;
    this.mode = data.mode;
    this.budgetCategoryForm=this._fb.group({
      budget_category:new FormControl('',[Validators.required,noLeadingSpaces()]),
    })
  }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    if(this.id){
      this.getBudgetCategoryById();
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
    if(this.budgetCategoryForm.invalid){
      return
    }
    data.budget_category=data.budget_category.trim();
    if(this.id){
      this._commonService.showLoader()
      this._configurationalmasterService.updateBudgetCategory(this.id, data,this.entity_id).subscribe(
        (res: any) => {
          this._commonService.hideLoader()
          // this.toaster.success('Budget category update successfully');
          // this.reloadCurrentRoute();
          // this.dialog.close();
          // this.budgetCategoryForm.reset();
          if (res.message === "Budget Category Already Existing!") {
            this.toaster.warning('Budget Category Already Existing!');
          }
          else {
            this.toaster.success('Budget category update successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.budgetCategoryForm.reset();
          }
        }, (err: any) => {
          this._commonService.hideLoader()
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
      this._commonService.showLoader()
      this._configurationalmasterService.createBudgetCategoryMaster(data, this.entity_id).subscribe(
        (res: any) => {
          this._commonService.hideLoader()
          // this.toaster.success('Budget Category added successfully');
          // this.reloadCurrentRoute();
          // this.dialog.close();
          // this.budgetCategoryForm.reset();
          if (res.message === "Budget Category Already Existing!") {
            this.toaster.warning('Budget Category Already Existing!');
          }
          else {
            this.toaster.success('Budget category added successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.budgetCategoryForm.reset();
          }
        },
          (err: any) => {
            this._commonService.hideLoader()
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
  getBudgetCategoryById() {
    this._commonService.showLoader()
    this._configurationalmasterService
      .getBudgetCategoryById(this.id)
      .subscribe((res: any) => {
        this._commonService.hideLoader()
        this.getData = res.data;
        this.budgetCategoryForm.patchValue({
          budget_category:this.getData.budget_category,
        })
      },(err:any) => {
        this._commonService.hideLoader()
      });
  }
}
