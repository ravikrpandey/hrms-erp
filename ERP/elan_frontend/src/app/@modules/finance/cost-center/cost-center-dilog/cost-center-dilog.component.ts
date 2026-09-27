import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-cost-center-dilog',
  templateUrl: './cost-center-dilog.component.html',
  styleUrls: ['./cost-center-dilog.component.scss']
})
export class CostCenterDilogComponent {
  itemData: any;
  budgetExtendForm:any;
  budgetData: any;
  submitted: boolean;
  status: any;
  costData: any;
  entity_id: string | null;
  constructor(
    private dialog: MatDialogRef<CostCenterDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,
    private fb:FormBuilder,
    private toast:ToastrService,
    private finaceService:FinaceService,
    private route: Router
  ) {

    this.status=data?.status;
    this.itemData = data?.cellData;
    this.costData=data?.data;
    
    this.budgetExtendForm=this.fb.group({
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      extend_type: new FormControl(null,[Validators.required])
    })
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');

    this.getCostCenter(this.itemData?.id)
  }
  getCostCenter(id:any){

  }


  onSubmitForm() {
    Object.keys(this.budgetExtendForm.controls).forEach(key => {
      this.budgetExtendForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.budgetExtendForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.budgetExtendForm.value;
    const data = {
      financial_year_id: this.costData?.financial_year_id,
      department_id:this.costData?.department_id,
      type: this.costData?.cost_center_type,
      // budgetAllocatedDate: moment(new Date).format('DD-MM-YYYY'),
      amount: Number(val.amount),
      extend_type: val.extend_type,
      cost_center_name:this.costData?.cost_center_name,
      cost_center_type:this.costData?.cost_center_type,
      cost_center_code:this.costData?.cost_center_code,
      region_id:this.costData?.region_id,
      id:this.costData?.id
      // employee_id: this.budgetData?.employee_id,
    };
    this.finaceService.createCostCenter(data,this.entity_id).subscribe(
      (res: any) => {
        if (res.message) {
          this.toast.success('Amount Added Successfully');
        }
        this.route.navigate([
          'master/finance/cost-center',
        ]);
        this.confirmDialog();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('amount Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.budgetExtendForm.value);
  }
}
