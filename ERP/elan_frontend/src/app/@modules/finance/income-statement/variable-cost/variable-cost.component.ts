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
  selector: 'app-variable-cost',
  templateUrl: './variable-cost.component.html',
  styleUrls: ['./variable-cost.component.scss']
})
export class VariableCostComponent {
  array : any = [];
  variableCostForm: any = [];
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
    this.variableCostForm = this.fb.group({
      total: new FormControl(null),
      institutional_support_fee: new FormControl(null),
      concession_fee: new FormControl(null),
      collection_fee: new FormControl(null),
      consultation_fee: new FormControl(null),
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

  makeArray = (w:any, h:any, val:any) => {
    var arr:any = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
  }

  populate = () => {
    this.array = this.makeArray(4,7,0)

    this.array[1][0] = "January"
    this.array[2][0] = "February"
    this.array[3][0] = "March"
    this.array[4][0] = "April"
    this.array[5][0] = "May"
    this.array[6][0] = "June"
    this.array[1][2] = "July"
    this.array[2][2] = "August"
    this.array[3][2] = "September"
    this.array[4][2] = "October"
    this.array[5][2] = "November"
    this.array[6][2] = "December"
    this.array[0][1] = "Price"
    this.array[0][3] = "Price"
    this.array[0][0] = 'Month'
    this.array[0][2] = 'Month'

    this.incomeService.getVariableCost(this.entity_id,this.fid,this.filter_fy).subscribe((res: any) => {
        this.rowData = res.data[0];
        this.variableCostForm.controls['collection_fee'].setValue(this.rowData.collection_fee)
        this.variableCostForm.controls['concession_fee'].setValue(this.rowData.concession_fee)
        this.variableCostForm.controls['consultation_fee'].setValue(this.rowData.consultation_fee)
        this.variableCostForm.controls['institutional_support_fee'].setValue(this.rowData.institutional_support_fee)

        let x:any = Number(this.rowData.collection_fee) + Number(this.rowData.concession_fee) + Number(this.rowData.consultation_fee) + Number(this.rowData.institutional_support_fee);
        let y : string = "";
        if ( x < 0 ) { 
          y = '(' + String(x) + ')';
          console.log(y)
          this.variableCostForm.controls['total'].setValue(y)
        }else {
          this.variableCostForm.controls['total'].setValue(x)
        }
        for ( let i = 1 ; i < 7; i++) {
          this.array[i][1] = this.rowData.month[i-1].seal_amount
        }
        for ( let j = 6 ; j < 12; j++) {
          this.array[j-5][3] = this.rowData.month[j].seal_amount
        }
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
