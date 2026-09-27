import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExcelDialogComponent } from 'src/app/@modules/buisness-intelligence/forecast-revenue/excel-dialog/excel-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-map-tds-account',
  templateUrl: './map-tds-account.component.html',
  styleUrls: ['./map-tds-account.component.scss']
})
export class MapTdsAccountComponent {

  accountForm: FormGroup = new FormGroup({});
  config: any;
  loginUser: any;
  fileToUpload: any ;
  title:any;
  dropdownlist:any;
  header:any;
  fYears: any = [];
  monthList:any = [];
  depreciationType:any = [];
  filter_fy:any;
  _configurationalMasterService: any;
  tdsData: any;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: Router,
    private _commonService : CommonService,
    private toast: ToastrService,
    private depreciationService: DepreciationService,
    private finance: FinaceService,
    public dialog: MatDialogRef<MapTdsAccountComponent>,
    public toaster: ToastrService,
    public _finaceservice: FinaceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.accountForm = this.fb.group({
      chart_account_id: new FormControl(null,[Validators.required]),
      mapped_chart_account_id: new FormControl(null), 
    });
  }
entity_id:any
  ngOnInit() {
     this.entity_id = localStorage.getItem('selectedEntityId')
    let lg: any = localStorage.getItem('signInUser')
    this.filter_fy = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(lg);
    this.getAllFinancialYear()
    this.chartOfAccountData()

   this.accountForm.get('mapped_chart_account_id')?.setValue(this.data?.chart_account_id)
  }
  getAccountName(id: number) {
    return this.chartOfAccount.find((x: { id: number; }) => x.id === id)?.account_name || '';
  }
  getAllFinancialYear() {
    this.finance.getFinancialYearActive().subscribe((res: any) => {
      this.fYears = res.data;
      // this.generateExcel();
    })
  }
  chartOfAccount:any=[]
  chartOfAccountData() {
   
    this._finaceservice.getChartOfAccountList(this.entity_id).subscribe((response: any) => {

      if (response) {
        this.chartOfAccount = response.data;
        // this.toast.success(response.message)
      }
    }, (err: any) => {
      // this.toast.error(err.error.message);
    })
  }

 
  createData(data:any){
    if(this.accountForm.invalid){
    return this.toaster.error('Required Field Should Not be Empty')

    }
    let payload={
      ...data.value,
      entity_id:this.entity_id
    }
     this._finaceservice.mapTdsCA(payload).subscribe((res:any)=>{
     this.toaster.success(res.message)
     this.dialog.close()
     this.reloadCurrentRoute()
     },(err:any)=>{
     this.toaster.error(err.error.message)
     this.dialog.close()
     })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
 


}
