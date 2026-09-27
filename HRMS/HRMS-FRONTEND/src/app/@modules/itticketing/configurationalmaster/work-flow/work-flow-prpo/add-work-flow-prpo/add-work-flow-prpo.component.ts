import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-work-flow-prpo',
  templateUrl: './add-work-flow-prpo.component.html',
  styleUrls: ['./add-work-flow-prpo.component.scss']
})
export class AddWorkFlowPrpoComponent implements OnInit {
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
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      roleFiled: new FormArray([
        new FormGroup({
          roleId: new FormControl(null, [Validators.required]),
          employeeId: new FormControl(null, [Validators.required]),
        }),
      ]),
      workflowType: new FormControl('', [Validators.required]),
      wokflowcategory: new FormControl('', [Validators.required]),
      workflowdepartment: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllItemDataList()
    this.activeRoute.queryParams.subscribe((res: any) => {
      this.workflowId = res.id;
    })
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getDepartment();
    this.getRoleAssign();
    this.entityList = localStorage.getItem('entityList')
    this.entityList = JSON.parse(this.entityList);
    this.entityIds = this.entityList.map((entity:any) => entity.entity_id);
    if (this.workflowId) {
      this.getWrokflowById();
    }
  }
  // createItemFormGroup() {
  //   return this.fb.group({
  //     roleId:new FormControl('',[Validators.required]),
  //     employeeId:new FormControl('',[Validators.required]),
  //   });
  // }
  get itemsFormArray():any {
    return this.form.get('roleFiled') as FormArray;
  }

  get CF_3(): any {
    return this.form.controls;
  }
  addItem() {
    const tableRows = this.form.get('roleFiled') as FormArray;
console.log(tableRows,'tableRows');
if (tableRows.value && tableRows?.value.length > 0) {
  let canAddNewRow = true;
  for (const obj of tableRows?.value) {
    if (!obj.employeeId ) {
        canAddNewRow = false;
        break;
    }
}

if(canAddNewRow){
  let data = this.fb.group({
    roleId: new FormControl('', [Validators.required]),
    employeeId: new FormControl('', [Validators.required]),
  });

  this.itemsFormArray.push(data);
  console.log(this.itemsFormArray, 'this.itemsFormArray');
 this.conditioncheck=true
}else{
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
    this._configurationalMasterService.getDepartment(this.entity_id).subscribe((res: any) => {
      this.department = res.data.filter((res: any) => res.status == "ACTIVE");
    })
  }
  getAllServices() {
    this._configurationalMasterService.getServiceMasterList().subscribe((res: any) => {
      const aa = res.data
    })
  }
  onSubmit(data: any) {
    console.log(data, 'dataa');
    data.roleFiled.forEach((role: any, index: any) => {
      role['level'] = index + 1;
    });
    console.log(data, 'data modified');

    if (this.workflowId) {
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        return
      }
      this._configurationalMasterService.updateWorkflowById(this.workflowId, data).subscribe((response: any) => {
        if (response) {
          if ( response.message == "WorkFlow Already Exists"){
            this.toaster.error(response.message);
          }else{
            this.toaster.success(response.message);
          }
          this.router.navigate(['master/workflow/workflow-PR'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message);
      })
    }
    else {
      this.workflowId = null;
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.toaster.error('All fields are Mendatory', 'Error Message')
        return
      }
      this._configurationalMasterService.createWorkflow(data).subscribe((response: any) => {
        if (response) {
          if ( response.message == "WorkFlow Already Exists"){
            this.toaster.error(response.message);
          }else{
            this.toaster.success(response.message);
          }
          // this.form.reset();
          this.router.navigate(['master/workflow/workflow-PR'])
        }
      }, (err: any) => {
        this.toaster.error(err.error.message)
      })
    }

  }
  getAllServiceList() {
    this._configurationalMasterService.getServiceCategoryMasterList().subscribe((res: any) => {
      this.getCat_data = res.data.filter((res:any) => res.status == "ACTIVE");
    })
  }
  getAllItemDataList() {
    this._configurationalMasterService.getAssetMasterList().subscribe((res: any) => {
      this.getCat_data = res.data.filter((res:any) => res.status == "ACTIVE");
    })
  }

  getAllBom() {
    let data = [
      { id: 1, bomCategory: 'PRODUCTION' },
      { id: 2, bomCategory: 'PACKGING' }
    ]
    console.log(data, 'data');
    this.getAllBomData = data;
  }
  workflowData: any
  getWorkflowVal(data: any) {
    this.workflowData = data.value;
    if (data.value == 'Item PR') {
      this.workflowTypeItem = data.value;
      this.getAllItemDataList();
      this.clearInput();
    } else if (data.value == 'BOM PR') {
      this.workflowTypeItem = data.value;
      console.log(data.value);
      this.getAllBom();
      this.clearInput();
    } else if (data.value == 'Item PO') {
      this.workflowTypeItem = data.value;
      console.log(data.value);
      this.getAllItemDataList();
      this.clearInput();
    }
    else {
      this.workflowTypeItem = data.value;
      this.getAllServiceList();
      this.clearInput();
    }
  }
  roleGet: any = []
  getRoleAssign() {
    this._rbacMasterService.getRole(this.loginUser.role).subscribe((res: any) => {
      this.roleGet = res.data;
    });
  }
  // arraid: any[] = []

  roleIdData(e: any, i: any) {
    console.log(e.value, 'eeeeee');
    console.log(i, 'iiii');
    // if (!this.arraid.includes(e.value)) {
    //   this.arraid.push(e.value);
    //   console.log(this.arraid, 'arraid');
    // }
    this._rbacMasterService.employeGetByroleId(e.value,this.entityIds).subscribe((res: any) => {
      console.log(res, 'resdata');
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
  getWrokflowById() {
    this._configurationalMasterService.getWorkflowById(this.workflowId).subscribe((response: any) => {
      this.workflowTypeItem = response.data?.workflow_type;
      this.dept = response.data?.department_name
      if (response.data?.workflow_type === 'Item PR') {
        this.getAllItemDataList()
      } else if(response.data?.workflow_type === "BOM PR"){
        this.getAllBom()
      } else if(response.data?.workflow_type === "Item PO"){
        this.getAllItemDataList()
      }else {
        this.getAllServiceList()
      }
      this.employeeDetails = response.data.employeedetails;
      setTimeout(() => {
        this.form.patchValue({
          workflowType: response.data?.workflow_type,
          wokflowcategory: response.data?.workflow_category,
          workflowdepartment: response.data?.dept_id,
        })
      }, 100);
      console.log(this.employeeDetails,'this.employeeDetails');
    //   let list: any[] = [];
    // const datarole = this.form.get('roleFiled') as FormArray;
    // console.log(datarole, 'datarole');

    // console.log(this.itemsFormArray.value, 'this.itemsFormArray.value');
    // this.employeeDetails.forEach((item: any) => {
    //   let filteredData = this.employeeDetails?.filter((elem: any) => {
    //     return !this.itemsFormArray.value.some((arrayData: any) => {
    //       return elem.employee_id === arrayData.employeeId;
    //     });
    //   });
    //   list.push(filteredData);
    // });

    // console.log(list, 'final list');
    // this.employeeDetails = list[0];
      this.employeeDetails.forEach((item: any, index: number) => {
        console.log(item,'itemmm');
        
        const formGroup = this.itemsFormArray.at(index) as FormGroup;
        console.log(formGroup,'formgroup');
        this._rbacMasterService.employeGetByroleId(item.role_master_id,this.entityIds).subscribe((res: any) => {
          console.log(res, 'resdata');
          this.roleGetByemployee[index] = res.data;
    
       
    
        });
        if (formGroup) {
          setTimeout(() => {
        // this.roleIdData(item.role_master_id, index)
            formGroup.patchValue({
              roleId: item.role_master_id,
              employeeId: item.employee_id,
              
            });
            
          }, 200)
          this.cdr.detectChanges();
        }
        else {
           this.itemsFormArray.push(
            this.fb.group({
              roleId: item.role_master_id,
              employeeId: item.employee_id,
            })
          );
        }
      });

     }, (err: any) => {
      this.toaster.error(err.error.message);
    })
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

