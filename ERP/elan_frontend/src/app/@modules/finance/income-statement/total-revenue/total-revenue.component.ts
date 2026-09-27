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
  selector: 'app-total-revenue',
  templateUrl: './total-revenue.component.html',
  styleUrls: ['./total-revenue.component.scss']
})
export class TotalRevenueComponent {
  array : any = [];
  totalRevenueForm: any = [];
  entity_id:any;
  fid:any;
  rowData:any = [];
  sealTypes: any = [];
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
    private incomeStatementService: IncomeStatementService,
    private configurationMaster: ConfigurationalmasterService
  ) {
    // shiftMasterForm
    this.totalRevenueForm = this.fb.group({
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
    this.array = [[0,0,0,0],[0,0,0,0]]
    this.populate()
  }

  populate = () => {
    for ( let i = 0 ; i < 13 ; i++ ) {
      this.array[i] = [0,0,0,0,0]
    }

    this.array[0][0] = 'January'
    this.array[1][0] = 'Feburary'
    this.array[2][0] = 'March'
    this.array[3][0] = 'April'
    this.array[4][0] = 'May'
    this.array[5][0] = 'June'
    this.array[6][0] = 'July'
    this.array[7][0] = 'August'
    this.array[8][0] = 'September'
    this.array[9][0] = 'October'
    this.array[10][0] = 'November'
    this.array[11][0] = 'December'
    this.array[12][0] = 'Total'

    this.incomeStatementService.getTotalRevenue(this.entity_id,this.fid, this.filter_fy).subscribe((res: any) => {
      this.rowData = res.data[0].month;
      console.log(this.rowData)
      
        for ( let i = 0 ; i < this.rowData.length; i++){
          for ( let j = 0; j < this.rowData[i].seal_type.length; j++) {
            this.array[i][j+1] += this.rowData[i].seal_type[j].seal_amount;
          }
        }

        for (let i = 1; i < this.array[0].length ; i++) {
          let sum = 0;
          for (let j = 0; j < this.array.length - 1; j++) {
            sum += this.array[j][i];
          }
          this.array[this.array.length-1][i] = sum;
        }

        for ( let i = 1; i < this.array[0].length; i++) {
          this.sumTotal = this.sumTotal + this.array[this.array.length-1][i];
        }

        this.totalRevenueForm.controls['total'].setValue(this.sumTotal)

      },(err:any) => {
      this.rowData = []
    })
   
  }

  apiOnLoad(){
   this.getSealType()
  }

  getSealType = () => {
    this.configurationMaster.listSealTypeActive().subscribe((res: any) => {
      this.sealTypes = res.data;
      for ( let i = 0 ; i < 12; i++){
        for ( let j = 1; j <= this.sealTypes.length; j++) {
          this.array[i][j] = 0;
        }
      }
      },(err:any) => {
      this.sealTypes = [];
    })
  }

  close(){
    this.router.navigate([`master/finance/income-statement/generate-income-statement`],{queryParams:{entity_id:this.entity_id,fid:this.fid,type:this.type}});
  }
}
