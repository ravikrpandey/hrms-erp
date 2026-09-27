import { Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-add-gl-mapping-account',
  templateUrl: './add-gl-mapping-account.component.html',
  styleUrls: ['./add-gl-mapping-account.component.scss']
})
export class AddGlMappingAccountComponent {
  form: FormGroup;
  getCat_data: any[] = [];
  department: any;
  workflowId: any;
  employeeDetails: any = [];
  workflowTypeItem: any;
  loginUser: any;
  item_masterData: any;
  getAllBomData: { id: number; bomCategory: string; }[];
  idemp: any;
  conditioncheck: boolean=false;
  roleGetByemployee: any[] = []
  entityList: any = [];
  entityIds: any = [];
dept: any;
  entity_id: any;
  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private _finaceService: FinaceService,

    private _commonService : CommonService,

  ) {
    let entity_id = localStorage.getItem('selectedEntityId')
    
    this.form = this.fb.group({
      roleFiled: new FormArray([
        new FormGroup({
          transaction_type: new FormControl(null, [Validators.required]),
          debit_account_id: new FormControl(null, [Validators.required]),
          credit_account_id: new FormControl(null, [Validators.required]),
          entity_id: new FormControl(entity_id),
        }),
      ]),
       
    });
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllItemDataList()
    this.getChartAccountList()
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.workflowId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getDepartment();
    
    this.entityList = localStorage.getItem('entityList')
    this.entityList = JSON.parse(this.entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
     
  }
  // createItemFormGroup() {
  //   return this.fb.group({
  //     roleId:new FormControl('',[Validators.required]),
  //     employeeId:new FormControl('',[Validators.required]),
  //   });
  // }


  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  chartedAccount:any=[]
  chartedAccountCredit:any=[]
  chartedAccount1Credit:any=[]
  chartedAccount2Credit:any=[]
  
  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;
      this.chartedAccountCredit = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1Credit = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2Credit = this.chartedAccount;
    });
  }
  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  } 
  accountFilterCredit(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2Credit.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccountCredit = filteredVariable
  }



  get itemsFormArray():any {
    return this.form.get('roleFiled') as FormArray;
  }

  get CF_3(): any {
    return this.form.controls;
  }
  addItem() {
  
    let entity_id = localStorage.getItem('selectedEntityId')

  let data = this.fb.group({
    transaction_type: new FormControl('', [Validators.required]),
    debit_account_id: new FormControl('', [Validators.required]),
    credit_account_id: new FormControl('', [Validators.required]),
    entity_id: new FormControl(entity_id),
  });

  this.itemsFormArray.push(data);
  
 this.conditioncheck=true
 

 


   
  }
  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }
  goBack() {
    this.location.back();
  }

  getDepartment() {
    this._configurationalMasterService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.department = res.data.filter((res: any) => res.status == "ACTIVE");
    })
  }
  getAllServices() {
    this._configurationalMasterService.getServiceMasterList(this.entity_id).subscribe((res: any) => {
      const aa = res.data
    })
  }
  onSubmit(data: any) {
     let payload={
      roleFiled:data.roleFiled
     }
     this._finaceService.createGlMappingTransactions(payload).subscribe((res:any)=>{
      if(res){
        this.toast.success(res.message)
        this.router.navigateByUrl('/master/configurational-master/gl-mapping-transactions')
      }
     },(err:any)=>{
      this.toast.error(err.error.message)
     })
  }
  getAllServiceList() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getServiceCategoryMasterList().subscribe((res: any) => {
      this.getCat_data = res.data.filter((res:any) => res.status == "ACTIVE");
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }
  getAllItemDataList() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.getCat_data = res.data.filter((res:any) => res.status == "ACTIVE");
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

 
 
 
  // arraid: any[] = []

  roleIdData(e: any, i: any) {
    console.log(e.value, 'eeeeee');
    console.log(i, 'iiii');
    // if (!this.arraid.includes(e.value)) {
    //   this.arraid.push(e.value);
    //   console.log(this.arraid, 'arraid');
    // }
    this._commonService?.showLoader()
    this._rbacMasterService.employeGetByroleId(e.value,this.entityIds).subscribe((res: any) => {
      console.log(res, 'resdata');
      this._commonService?.hideLoader()
      this.roleGetByemployee[i] = res.data;

      // this.roleGetByemployee[i] = res.data;

      // if(this.conditioncheck==true){
      //   this.filterEmp(i)

      // }

    });
  };

  // filterEmp(i:any){
    
  //   let list: any[] = [];
  //   const datarole = this.form.get('roleFiled') as FormArray;
  //   console.log(datarole, 'datarole');

  //   console.log(this.itemsFormArray.value, 'this.itemsFormArray.value');
  //   this.roleGetByemployee[i].forEach((item: any) => {
  //     let filteredData = this.roleGetByemployee[i]?.filter((elem: any) => {
  //       return !this.itemsFormArray.value.some((arrayData: any) => {
  //         return elem.employee_id === arrayData.employeeId;
  //       });
  //     });
  //     list.push(filteredData);
  //   });

  //   console.log(list, 'final list');
  //   this.roleGetByemployee[i] = list[0];
  // }
  selectemp(e: any,index:any) {
    console.log(e, 'eeee');
    this.idemp = e.value;

    console.log(this.roleGetByemployee[index], 'this.roleGetByemployee');
    // const dataEmp=this.roleGetByemployee[0];
    const roleData:any=this.roleGetByemployee[index]
    let currentList=this.itemsFormArray.value;  
    
    console.log(this.itemsFormArray, 'this.itemsFormArray');
    

    console.log(currentList,'currentList');
    let isDuplicate = true;
    let newList = currentList.slice();
    if(currentList && currentList.length > 0) newList.splice(index, 1)
      // alert("in")
      newList.map((item:any)=>{
        console.log(item,'iteeem');
  
        if(item.employeeId == this.idemp){
        isDuplicate = false;
        this.toast.error('This EMP has been already added')
        this.resetEmployeeId(index);
    this.itemsFormArray?.at(index).get('employeeId').reset();
        
        }
        
      })
    
      
 // let isDuplicate = true;
    // let newList = currentList.slice();
    // console.log(newList,'newListnewList');
    // console.log(index,'index');
    // console.log(currentList,'currentList');
    
    // if (currentList && currentList.length > 0) newList.splice(index, 1)
    // newList?.map((item: any) => {
    //   console.log(item,'itemv');
      
    //   if (item.employeeId == this.idemp) {
    //     isDuplicate = false;
    //     // this.toast.error('This variant has been already added.')
    //     alert("11")
        
    //   };
    // });

  }
  resetEmployeeId(index: any) {
    const control:any = (this.form.get('roleField') as FormArray)?.at(index).get('employeeId');
    control?.reset(); // Resetting the value of employeeId FormControl
  }
  



  clearInput() {
    this.form.get('wokflowcategory')?.reset()

  }
  patchData(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach((k) => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  };
}
