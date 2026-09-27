import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';


@Component({
  selector: 'app-add-financial-transactions-integrations',
  templateUrl: './add-financial-transactions-integrations.component.html',
  styleUrls: ['./add-financial-transactions-integrations.component.scss']
})
export class AddFinancialTransactionsIntegrationsComponent {
  createJournalEntryForm: FormGroup;
  loading: boolean = false;
  financialTransaction: FormGroup;
  createJournalreferanceForm: FormGroup;
  totalDebit: any;
  totalCredit: any;
  Different: any;
  redColor: boolean = false;
  chartedAccount: any = [];
  journal_id: any;
  singleGeneral: any = [];
  accountDetailList: any;
  paramsType: any;
  reversal: boolean = false;
  entity_id: any;
  getAllModuleList:any;
  getAllSubModuleList: any =[]
  modulesDataType:any=[]
  invoiceAccount:any=[]
  constructor(private fb: FormBuilder, public $common: CommonService,
     public dialog: MatDialog, private toast: ToastrService, private router: Router, 
     private _finaceService: FinaceService, private activeroute: ActivatedRoute,
     private _configaration:ConfigurationalmasterService
) {
    
    
let entity_ids = localStorage.getItem("selectedEntityId")
    this.financialTransaction = this.fb.group({
      menu_master_id:[''],
      sub_module_id:[''],
      entity_id:[entity_ids],
      Account_details: this.fb.array([this.createAccountDetailGroup()])
    });


  }

  financial_id: any;

  ngOnInit() {
    // this.Account_details.removeAt(0)
    // this.Account_details.removeAt(1)
     
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    localStorage.setItem('employee_id:', 'undefined');
    this.getChartAccountList()
 
  }
 
AddRow()
{
 
     this.Account_details.push(this.createAccountDetailGroup());
 
}

removeRow(index:any){
 this.Account_details.removeAt(index);
}

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

    });
  }
isDisable:boolean=false
  getSubmodulesData(item:any,i:any){
 let master_ids = this.financialTransaction.get('menu_master_id')?.value
this._configaration.getfinancialTransactionsById(master_ids,item.menu_master_id).subscribe((res:any)=>{
  if(res.data.length){
    this.Account_details.removeAt(0)
  }
  res.data.forEach((res:any)=>{
      let controls=  this.fb.group({
        chart_account_id: [res.chart_of_account_id],
        mapping_account: [res.mapping_component],
        debit_credit: [res.debitCredit],
      })
       this.Account_details.push(controls)
  })
})


  //   if(item.menu_master_name=='GRN')
  //  {
  //     this.Account_details.clear()

  //   this.modulesDataType=[
  //     {
  //       id:1,
  //       name:'Stock In Hand',
  //     },
  //     {
  //       id:2,
  //       name:'Stock Received But Not Billed'
  //     },         
  //   ]
  //   this.modulesDataType.forEach((res:any)=>{
  //     let controls=  this.fb.group({
  //       chart_account_id: [null, Validators.required],
  //       mapping_account: [res.name],
  //       debit_credit: [res.name == 'Stock In Hand' ? 'debit' : 'credit', Validators.required],
         
  //     });
  //     this.Account_details.push(controls)
  
  //     })
  //  }
  //  else if(item.menu_master_name=='Sales Invoice'){
  //   this.Account_details.clear()

  //   this.invoiceAccount=[
  //     {
  //       id:1,
  //       name:'Revenue'
  //     },
  //     {
  //       id:2,
  //       name:'IGST'
  //     }, 
  //     {
  //       id:3,
  //       name:'SGST'
  //     }, 
  //       {
  //       id:4,
  //       name:'CGST'
  //     },
           
  //      {
  //       id:5,
  //       name:'Advance Receipt',
  //       debit:true
  //     },
  //   ]

  //   this.invoiceAccount.forEach((res:any)=>{
  //     let controls=  this.fb.group({
  //       chart_account_id: [null, Validators.required],
  //       mapping_account: [res.name],
  //       debit_credit: [res.debit?'debit':'credit'],
         
  //     });
  //     this.Account_details.push(controls)
  //   })
  //  }
  //  else if(item.menu_master_name=='Bank Payment' || item.menu_master_name=='Cash Payment' || item.menu_master_name=='Bank Receipt' || item.menu_master_name=='Cash Receipt'){
  //     this.Account_details.clear()
  //    this.isDisable = true
  //    this.modulesDataType=[
  //     {
  //       id:1,
  //       name:"Employee's Account"
  //     },
          
  //   ]
  //   this.modulesDataType.forEach((res:any)=>{
  //     let controls=  this.fb.group({
  //       chart_account_id: [null, Validators.required],
  //       mapping_account: [res.name],
  //       debit_credit: [item.menu_master_name=='Bank Receipt' || item.menu_master_name=='Cash Receipt'?'credit':'debit',],
         
  //     });
        
  //     this.Account_details.push(controls)
  
  //     })
      
  //  }
  
    

  }


  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }




  get Account_details(): FormArray {
    return this.financialTransaction.get('Account_details') as FormArray;
  }

  createAccountDetailGroup(): any {
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      mapping_account: [null, Validators.required],
      debit_credit: [null, Validators.required],
       
    });
  }

getModule :any;
  getAllModule(id:any){
   
    this._configaration.financialTransactionIntegration(id.value).subscribe((res:any)=>{
      this.getModule = res.data
    })
   
  }
  
  DebitCedit(id:any){
    console.log("-------new",id.value)
  }

   
 





  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null)
    if (control == 'chart_account_id') {
       
    }
  }




 



 







  bankAccountIds: any[] = [];



  submitPublic(key: any): void {
    
   this.$common.showLoader()

 let paylod={
              
                ...this.financialTransaction.value,
              }

                  this.bankAccountIds = [];
                  this._finaceService.createFinacialTransactionIntegration(paylod).subscribe((response: any) => {
                    if(response){
                      this.toast.success('Finacial Transaction Created Successfully')
                      this.router.navigate(['/master/configurational-master/financial-transactions-integrations/financial-transactions-integrations-list'])
                      this.$common.hideLoader()
                    }else{
                      this.$common.hideLoader()
                  
                    }
 
          })

 
    
  }









  back(){
    this.router.navigate(['/master/configurational-master/financial-transactions-integrations/financial-transactions-integrations-list'])
  }

}
