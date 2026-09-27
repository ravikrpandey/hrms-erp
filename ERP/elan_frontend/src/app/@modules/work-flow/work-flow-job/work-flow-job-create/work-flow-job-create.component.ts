import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-work-flow-job-create',
  templateUrl: './work-flow-job-create.component.html',
  styleUrls: ['./work-flow-job-create.component.scss']
})
export class WorkFlowJobCreateComponent {

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
  conditioncheck: boolean = false;
  roleGetByemployee: any[] = []
  roleGetByemployee2: any[] = []
  employees: any[] = []
  dept: any;
  typeData: any;
  deptId: any;
  entity_id: any;
  showAddButton:any= true;

  showFieldQuotation:boolean=false;
  entityList:any;
  entityIds: any;
type: any;
  typeData2: any;
  types: any;
  department2: any;
  departments: any;
  roles:any[] = [];
  roleGet: any[] = []
  roleGet2:any[] = [];
  levelType: any;
 
  itemLists:any;
  cetegory: any[]=[];
  branchList:any;
  subCategory: { [outerIndex: number]: { [innerIndex: number]: any[] } } = {};

  constructor(private location: Location,
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbacMasterService: RbacMasterService,
    private toaster: ToastrService,
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private entityService: EntityMasterService,
    private _commonService : CommonService
  ) {
    this.form = this.fb.group({
      job_request_id:new FormControl(null),
      department_id: new FormControl(''),
      branch_id: new FormControl(''),
      branch_name: new FormControl(''),
      budget_planning_type: new FormControl(''),
      roleFiled: new FormArray([
        new FormGroup({
          workflow_range_id:new FormControl(null),
          role_id: new FormControl(null),
          employee_id: new FormControl(null),
          branch_id: new FormControl(null),
          // discount_percent: new FormControl(null, [Validators.required]),
          level_type_id: new FormControl(null),
          remark: new FormControl(null),
          itemList:new FormArray([]),
        }),
      ]),
      // workflowType: "RFP",
    });
  }
  ngOnInit(): void {
    // this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.workflowId = res.id;
    })
   
    let idEntity=localStorage.getItem('selectedEntityId')
    this.entity_id = Number(idEntity);
    console.log(this.entity_id,'this.entity_id')
    let lg: any = localStorage.getItem('signInUser')
    let entityList: any = localStorage.getItem('entityList')
    this.entityList = JSON.parse(entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
    this.loginUser = JSON.parse(lg);
    this.getDepartment();
    this.getRoleAssign();
    this.getLevelType();
    this.getEntity();
    if (this.workflowId) {
      this.getWrokflowById();
    }
    this.getTYpe()
    this.getAllCategory();
    this.getBranchList();
  }

  getEntity = () => {
    this._commonService?.showLoader()
    this.entityService.getEntityList().subscribe((res:any)=>{
      this.entityList= res?.data;
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }


  getTYpe(){
  // this.typeData=[
  //   {type:"Job Request",id:1},
  //   {type:"Budget Planning",id:2}
  // ]
  // console.log(this.typeData,'data');
  this._commonService?.showLoader()
  this._configurationalMasterService.getTypeRequest().subscribe((res:any)=>{
    this._commonService?.hideLoader()
    this.typeData= res?.data;
    this.typeData2= res?.data;
    this.types = this.typeData.map((value:any) => value.type)
    console.log("?{",this.typeData)
  },(err:any) => {
    this._commonService?.hideLoader()
  })
  }
  get itemsFormArray(): any {
    return this.form.get('roleFiled') as FormArray;
  }
  get itemList(): any {
    return this.form.get('itemList') as FormArray;
  }

  itemListForm(){
    return this.fb.group({
      product_category_id:new FormControl(null,[Validators.required]),
product_sub_category_id:new FormControl(null,[Validators.required]),
      discount_flat: new FormControl(null, [Validators.required]),
      discount_percent: new FormControl(null, [Validators.required]),
     })
  }
  
  addItemList(roleIndex:number){
    
    this.discountItemList(roleIndex).push(this.itemListForm());
  }
  
  
  discountItemList(itemIndex: number): FormArray {
    return this.itemsFormArray.at(itemIndex).get('itemList') as FormArray;
  }
  removeEmployeeSkill(roleIndex: number, itemIndex: number): void {
    this.discountItemList(roleIndex).removeAt(itemIndex);
  }
  
  get CF_3(): any {
    return this.form.controls;
  }
  addItem(i:any) {
    if(this.form.controls['job_request_id'].value == 'Quotation') {
      this.roleIdData({value:'ALL'}, i+1);
    }
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleGet[i+1] = res.data;
      this.roleGet2[i+1] = res.data;
      this.roles[i+1] = this.roleGet[i+1].map((value:any) => value.role_master_name); 
    })
    const tableRows = this.form.get('roleFiled') as FormArray;
    console.log(tableRows, 'tableRows');
    if (tableRows.value && tableRows?.value.length > 0) {
      let canAddNewRow = true;
      for (const obj of tableRows?.value) {
        if (!obj.employee_id) {
          canAddNewRow = false;
          break;
        }
      }

      if (canAddNewRow) {
        let data = this.fb.group({

          workflow_range_id: new FormControl(null),
          role_id: new FormControl(null),
          employee_id: new FormControl('',),
          branch_id: new FormControl(null),
          // discount_percent: new FormControl(null, [Validators.required]),
          level_type_id: new FormControl(null,),
          remark: new FormControl('', ),
          itemList:new FormArray([]),
        });

        this.itemsFormArray.push(data);
let len  = this.itemsFormArray.length;
        this.addItemList(len-1);
        console.log(this.itemsFormArray, 'this.itemsFormArray');
        this.conditioncheck = true
      } else {
        this.toast.warning("Please add first Row")
      }

    }



  }
  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }
  goBack() {
    this.location.back();
  }

  getDepartment() {
    this._commonService?.showLoader()
    this._configurationalMasterService.get_all_workflow_department(this.loginUser.employee_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.department = res.data.filter((res: any) => res.status == "ACTIVE");
      this.department2 = res.data.filter((res: any) => res.status == "ACTIVE");
      this.departments = this.department.map((value:any) => value.department_name)
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  getLevelType() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getLevelType(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.levelType = res.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  onSelectedType = (e:any) => {
    
    if ( this.form.controls['job_request_id'].value == 'Budget Planning') {
      this.showAddButton = false;
      this.showFieldQuotation = false; 
      const roleFiledArray = this.form.get('roleFiled') as FormArray;
      for (let i = roleFiledArray.length - 1; i > 0; i--) {
        roleFiledArray.removeAt(i); // Remove FormGroup at index i
      }
    }else if ( this.form.controls['job_request_id'].value == 'Quotation' ) {
      this.showAddButton = true;
      this.showFieldQuotation = true; 
      let len = this.itemsFormArray.length;
      this.addItemList(len-1);
      this.roleIdData({value:'ALL'}, 0);
    } else {
      this.showAddButton = true;
      this.showFieldQuotation = false; 
    }
  }  

  onSubmit(data: any) {
    if ( this.showAddButton ) {
      this.form.controls['budget_planning_type'].setValue(null);
      const budgetPlanningTypeControl = this.form.get('budget_planning_type');
      budgetPlanningTypeControl?.clearValidators();
      budgetPlanningTypeControl?.updateValueAndValidity();
    }
    if ( this.showFieldQuotation ) {
      // use for department
      this.form.controls['department_id'].setValue(null);
      const departmentControl = this.form.get('department_id');
      departmentControl?.clearValidators();
      departmentControl?.updateValueAndValidity();

      // use for employee role
      const roleArray = this.form.get('roleFiled') as FormArray;
      roleArray.controls.forEach((group: AbstractControl) => {
        const roleControl = group.get('role_id');
        if (!roleControl) return;
        roleControl.clearValidators();
        if (roleControl.value === '') {
          roleControl.setValue(null, { emitEvent: false });
        }
        roleControl.updateValueAndValidity();
      });
    }
    if ( !this.showFieldQuotation ) {

      const roleArray = this.form.get('roleFiled') as FormArray;
      const fieldsToClear = ['discount_flat', 'discount_percent', 'level_type_id', 'remark'];

      roleArray.controls.forEach((group: AbstractControl) => {
        fieldsToClear.forEach(field => {
          const control = group.get(field);
          if (!control) return;

          control.clearValidators();
          if (control.value === '') {
            control.setValue(null, { emitEvent: false });
          }
          control.updateValueAndValidity();
        });
      });
    }

    console.log(data,'data');
    console.log(this.form.value);
    
    let checkData: any; // Assuming the type of items in typeData is 'any'

    // Find the item in typeData array that matches the condition
    checkData = this.typeData.find((item:any) => item?.id == data?.job_request_id);
    console.log(checkData,'checkData');
    
  
  

    if (this.workflowId) {
      // if (this.form.invalid) {
      //   this.form.markAllAsTouched()
      //   return
      // }
      let dataModify={
        department_id:data?.job_request_id=='Quatation' ? null : this.deptId,
        roleFiled:data?.roleFiled,
        job_request_id:checkData?.id,
        job_name:data?.job_request_id,
        budget_planning_type:data?.budget_planning_type,
        entity_id:this.entity_id,
        branch_id:data?.branch_id
      }
      console.log(data, 'dataa');
      dataModify.roleFiled.forEach((role: any, index: any) => {
        role['level'] = index + 1;
      });
      console.log(dataModify, 'data modified');
      this._commonService?.showLoader()
      this._configurationalMasterService.updateWorkFlowJob(this.workflowId,dataModify).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          if (response.message == "WorkFlow Already Exists") {
            this.toaster.error(response.message);
          } else {
            this.toaster.success(response.message);
          }
          this.router.navigate(['master/workflow/work-flow-job'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.workflowId = null;
      
      // if (this.form.invalid) {
      //   this.form.markAllAsTouched()
      //   this.toaster.error('All fields are Mandatory', 'Error Message')
      //   return
      // }
      let dataModify={
        department_id:data?.job_request_id==="Quotation" ? null : data?.department_id,
        roleFiled:data?.roleFiled,
        job_request_id:checkData?.id,
        job_name:data?.job_request_id,
        budget_planning_type:data?.budget_planning_type,
        entity_id:this.entity_id,
        branch_id:data?.branch_id
      }
      console.log(data, 'dataa');
      dataModify.roleFiled.forEach((role: any, index: any) => {
        role['level'] = index + 1;
      });
      console.log(dataModify, 'data modified');
      this._commonService?.showLoader()
      this._configurationalMasterService.createWorkFlowJob(dataModify).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          if (response.message == "WorkFlow Already Exists") {
            this.toaster.error(response.message);
          } else {
            this.toaster.success(response.message);
          }
          this.router.navigate(['master/workflow/work-flow-job'])
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        this.toaster.error(err.error.message)
      })
    }
  }


  getRoleAssign(length?:any) {
    this._commonService?.showLoader()
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleGet[0] = res.data;
      this._commonService?.hideLoader()
      this.roleGet2[0] = res.data;
      this.roles[0] = this.roleGet[0].map((value:any) => value.role_master_name);
      console.log(this.roles[0],'this.roleGet');
      
      if ( length ) {
        for( let i = 0 ; i < length; i++ ) {
          this.roleGet[i] = this.roleGet[0]
          this.roleGet2[i] = this.roleGet[0]
          this.roles[i] = this.roleGet[0].map((value:any) => value.role_master_name);
        }
      }
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }

  typeFilter(e: any) {
    const aa = e
    let filteredVariable = this.typeData2.filter((item: any) => aa.includes(item.type));
    this.typeData = filteredVariable
  }

  departmentFilter(e: any) {
    const aa = e
    let filteredVariable = this.department2.filter((item: any) => aa.includes(item.department_name));
    this.department = filteredVariable
  }

  roleFilter(e: any,i:any) {
    const aa = e
    let filteredVariable = this.roleGet2[i].filter((item: any) => aa.includes(item.role_master_name));
    this.roleGet[i] = filteredVariable
  }

  empFilter(e: any,i:any) {
    const aa = e
    let filteredVariable = this.roleGetByemployee2[i].filter((item: any) => aa.includes(item.first_name));
    this.roleGetByemployee[i] = filteredVariable
  }

  // roleIdData(e: any, i: any) {
  //   console.log(e.value, 'eeeeee');
  //   console.log(i, 'iiii');
  //   this._commonService?.showLoader()
  //   this._rbacMasterService.employeGetByroleId(e.value,this.entity_id).subscribe((res: any) => {
  //     console.log(res, 'resdata');
  //     this._commonService?.hideLoader()
  //     this.roleGetByemployee[i] = res.data;
  //     this.roleGetByemployee2[i] = res.data;
  //     this.employees[i] = this.roleGetByemployee[i].map((value:any) => value.first_name)
  //   },(err: any ) => {
  //     this._commonService?.hideLoader()
  //     this.roleGetByemployee[i] = []
  //   });
  // };

  selectemp(e: any, index: any) {
    console.log(e, 'eeee');
    this.idemp = e.value;

    console.log(this.roleGetByemployee[index], 'this.roleGetByemployee');
    const roleData: any = this.roleGetByemployee[index]
    let currentList = this.itemsFormArray.value;

    console.log(this.itemsFormArray, 'this.itemsFormArray');


    console.log(currentList, 'currentList');
    let isDuplicate = true;
    let newList = currentList.slice();
    if (currentList && currentList.length > 0) newList.splice(index, 1)
    newList.map((item: any) => {
      console.log(item, 'iteeem');

      if (item.employee_id == this.idemp) {
        isDuplicate = false;
        this.toast.error('This EMP has been already added')
        this.resetEmployeeId(index);
        this.itemsFormArray?.at(index).get('employee_id').reset();
      }
    })
  }
  resetEmployeeId(index: any) {
    const control: any = (this.form.get('roleField') as FormArray)?.at(index).get('employee_id');
    control?.reset(); // Resetting the value of employeeId FormControl
  }

  // getWrokflowById() {
  //   this._configurationalMasterService.getByWorkFlowJob(this.workflowId).subscribe((response: any) => {
  //     this.workflowTypeItem = response.data?.workflow_type;
  //     if ( response.data?.job_name == 'Budget Planning' ) {
  //       this.showAddButton = false; 
  //     }else if ( response.data?.job_name == 'Quotation' ) {
  //       this.showFieldQuotation = true; 
  //     }
  //     
  //     this.dept = response.data?.department_id;
  //     this.deptId = response.data?.department_id
  //     this.employeeDetails = response.data.roleFiled;
  //     setTimeout(() => {
  //       this.form.patchValue({
  //         workflowdepartment: response.data?.dept_id,
  //         job_request_id:response.data?.job_name,
  //         department_id:response.data?.department_name,
  //         budget_planning_type: response.data?.budget_planning_type,
  //         entity_id:response.data?.entity_id,
  //         branch_id :response?.data?.branch_id, 
  //         branch_name :response?.data?.branch_name 
  //       })
  //     }, 100);
  //     console.log(this.employeeDetails, 'this.employeeDetails');
  //     this.getRoleAssign(this.employeeDetails.length)
  //     this.employeeDetails.forEach((item: any, index: number) => {
  //       if ( response.data?.job_name == 'Quotation' ) {
  //         this.roleIdData({value:'ALL'}, index);
  //       }
  //       console.log(item, 'itemmm');
  //       // console.log(formGroup, 'formgroup');
  //       console.log(this.entityIds,'this.entityIds');
        
  //       this._rbacMasterService.employeGetByroleId(item.role_id,this.entity_id).subscribe((res: any) => {
  //         console.log(res, 'resdata<<<<<<<<<');
  //         this.roleGetByemployee[index] = res.data;
  //         this.roleGetByemployee2[index] = res.data;
  //         this.employees[index] = this.roleGetByemployee[index].map((value:any) => value.first_name)
  //       });
  //       console.log('testing --------------------',this.roleGetByemployee[index])
  //       if(item.branch_id){

  //         this.selectedBranch(item.branch_id,index);
  //       }
        
  //       const formGroup = this.itemsFormArray.at(index) as FormGroup;
  //         const itemListArray = this.createItemListFormArray(item.itemList || [],index);
  //       if (formGroup) {
  //         console.log(item,'item 1');
         
  //         setTimeout(() => {
  //           // this.roleIdData(item.role_id, index)
  //           formGroup.patchValue({
  //             workflow_range_id:item.workflow_range_id,
  //             role_id: item.role_id,
  //             employee_id: item.employee_id,
  //             branch_id:item.branch_id,
  //             level_type_id: item.level_type_id,
  //             remark: item.remark,
  //           });
  //           formGroup.setControl('itemList', itemListArray);
  //         }, 200)
         

  // // Prepare itemList FormArray
  
  //         this.cdr.detectChanges();
  //       }
  //       else {
  //         console.log(item,'item 2');
  //         // this.roleIdData(item.role_id, index)

  //         this.itemsFormArray.push(
  //           this.fb.group({
  //             role_id: item.role_id,
  //             workflow_range_id:item.workflow_range_id,
  //             employee_id: item.employee_id,
  //             branch_id:item.branch_id,
  //             discount_flat: item.discount_flat,
  //             discount_percent: item.discount_percent,
  //             level_type_id: item.level_type_id,
  //             remark: item.remark,
  //             itemList: itemListArray
  //           })
  //         );
  //         // this.selectedBranch(item.branch_id,index);
  //       }
  //     });
  //   }, (err: any) => {
  //     this.toaster.error(err.error.message);
  //   })
  // }

  async getWrokflowById() {
    try {
      const response: any = await lastValueFrom(
        this._configurationalMasterService.getByWorkFlowJob(this.workflowId)
      );
  
      const data = response.data;
      this.workflowTypeItem = data?.workflow_type;
  
      // UI flags based on job name
      this.showAddButton = data?.job_name !== 'Budget Planning';
      this.showFieldQuotation = data?.job_name === 'Quotation';
  
      // Store some IDs
      this.dept = data?.department_id;
      this.deptId = data?.department_id;
      this.employeeDetails = data?.roleFiled || [];
  
      // Patch main form
      this.form.patchValue({
        workflowdepartment: data?.dept_id,
        job_request_id: data?.job_name,
        department_id: data?.department_name,
        budget_planning_type: data?.budget_planning_type,
        entity_id: data?.entity_id,
        branch_id: data?.branch_id,
        branch_name: data?.branch_name
      });
  
      // Create form array entries
      this.getRoleAssign(this.employeeDetails.length);
  
      for (let [index, item] of this.employeeDetails.entries()) {
        // If job is Quotation, load employees
        if (data?.job_name === 'Quotation') {
          await this.roleIdData({ value: 'ALL' }, index);
          this.selectedBranch(item.branch_id,index);
        }else{
          this._rbacMasterService.employeGetByroleId(item.role_id,this.entity_id).subscribe((res: any) => {
          
            this.roleGetByemployee[index] = res.data;
            this.roleGetByemployee2[index] = res.data;
            this.employees[index] = this.roleGetByemployee[index].map((value:any) => value.first_name)
          });
        }
        // this.selectedBranch(item.branch_id, index);
  
        const formGroup = this.itemsFormArray.at(index) as FormGroup;
        const itemListArray = this.createItemListFormArray(item.itemList || [], index);
  
        if (formGroup) {
          formGroup.patchValue({
            workflow_range_id: item.workflow_range_id,
            role_id: item.role_id,
            employee_id: item.employee_id,
            branch_id: item.branch_id,
            level_type_id: item.level_type_id,
            remark: item.remark
          });
          formGroup.setControl('itemList', itemListArray);
        } else {
          this.itemsFormArray.push(
            this.fb.group({
              role_id: item.role_id,
              workflow_range_id: item.workflow_range_id,
              employee_id: item.employee_id,
              branch_id: item.branch_id,
              discount_flat: item.discount_flat,
              discount_percent: item.discount_percent,
              level_type_id: item.level_type_id,
              remark: item.remark,
              itemList: itemListArray
            })
          );
        }
  
        this.cdr.detectChanges();
      }
    } catch (err: any) {
      this.toaster.error(err?.error?.message || 'Something went wrong');
    }
  }





  async roleIdData(e: any, i: number): Promise<void> {
    this._commonService?.showLoader();
  
    try {
      const res: any = await lastValueFrom(
        this._rbacMasterService.employeGetByroleId(e.value, this.entity_id)
      );
  
      this.roleGetByemployee[i] = res.data;
      this.roleGetByemployee2[i] = res.data;
      this.employees[i] = res.data.map((emp: any) => emp.first_name);
    } catch (err) {
      console.error('Employee fetch error:', err);
      this.roleGetByemployee[i] = [];
    } finally {
      this._commonService?.hideLoader();
    }
  }
  
  createItemListFormArray(items: any[], outerIndex: number): FormArray {
    return this.fb.array(
      items.map((listItem, index) => {
        
        //this.getSubCategory(listItem.product_category_id, outerIndex, index);
  
        return this.fb.group({
          product_category_id: [listItem.product_category_id, Validators.required],
          product_sub_category_id: [listItem.product_sub_category_id, Validators.required],
          discount_flat: [listItem.discount_flat, Validators.required],
          discount_percent: [listItem.discount_percent, Validators.required],
        });
      })
    );
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

  onKeyChange(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete'
    ];

    // Allow numbers and allowedKeys
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
  getSubCategory(categoryId: any, outerIndex: number, innerIndex: number) {
    
    const categoryValue = categoryId?.value ?? categoryId;
    this._configurationalMasterService.getSubCategory(categoryValue).subscribe(
      (res: any) => {
        if (res.code === 201) {
          this.toast.error(res.message);
          return;
        }
  
        if (!this.subCategory[outerIndex]) {
          this.subCategory[outerIndex] = {};
        }
  
        this.subCategory[outerIndex][innerIndex] = res.data;
  
      },
      error => {
        this.toast.error(error.message);
      }
    );
  }
  
  getAllCategory() {
    this._configurationalMasterService.getActiveAssetMasterList()
      .subscribe((res: any) => {
        this.cetegory = res.data;
      });
  }
  getBranchList() {
    this._configurationalMasterService.listBranch().subscribe((res: any) => {
        this.branchList = res.data;
      });
  }

  selectedBranch(event:any,index:number){
    this._configurationalMasterService.getAllEmployeeByBranchId(event).subscribe({
      next:(res:any) =>{
        if(!res.success){
          
          this.roleGetByemployee[index].length=0;
         return this.toast.error(res.message)
        }
        this.roleGetByemployee[index] = res.data;
      },error:(err) =>{
      return  this.toast.error(err.error.message)
      },
    });
  }
  selectedBranch2(event:any){
    this._configurationalMasterService.getAllEmployeeByBranchId(event).subscribe({
      next:(res:any) =>{
      }
    });
  }
}
