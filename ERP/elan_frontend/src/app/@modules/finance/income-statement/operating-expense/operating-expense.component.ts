import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray,AbstractControl,ValidatorFn } from '@angular/forms';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { environment } from 'src/app/environments/environment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { IncomeStatementService } from 'src/app/@shared/services/income-statement.service';

const databaseKey: any = environment.servralUrl;
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}
@Component({
  selector: 'app-operating-expense',
  templateUrl: './operating-expense.component.html',
  styleUrls: ['./operating-expense.component.scss']
})
export class OperatingExpenseComponent {
  array : any = [];
  operatingExpenseForm: any = [];
  entity_id:any;
  fid:any;
  rowData:any;
  sumTotal:any = 0;
  filter_fy:any;
  type:any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private _rbackMasterService : RbacMasterService,
    private config: ConfigurationalmasterService,
    private toaster:ToastrService,
    private entityService: EntityMasterService,
    private finace : FinaceService,
    private incomeService: IncomeStatementService
  ) {
    // shiftMasterForm
    this.operatingExpenseForm = this.fb.group({
      total: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.apiOnLoad();
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.entity_id = params.entity_id
      this.fid = params.fid;
      this.type = params.type;
    })
    this.array = [[],[]]
    this.populate()
  }

  populate = () => {
    this.incomeService.getTotalOperatingExpense(this.entity_id,this.fid, this.filter_fy).subscribe((res: any) => {
      this.rowData = res.data[0].budget_category;
      console.log(this.rowData)
        for ( let i = 0 ; i < this.rowData.length; i++) {
          this.array[i][0] = this.rowData[i].budget_category
          let j = 1;
          for ( let key in  this.rowData[i].month ) {
            this.array[i][j] = this.rowData[i].month[key];
            this.sumTotal += Number(this.rowData[i].month[key]);
            j++;
          }
        }
        this.operatingExpenseForm.controls['total'].setValue(this.sumTotal)
      },(err:any) => {
      this.rowData = []
    })
  }

  apiOnLoad(){
    // /api/v1/getAllRoleMaster/Super%20Admin
  }
  
  close(){
      this.router.navigate([`master/finance/income-statement/generate-income-statement`],{queryParams:{entity_id:this.entity_id,fid:this.fid,type:this.type}});
  }
}
