import { Component } from '@angular/core';
import { FormBuilder,FormControl,Validators,ValidatorFn,AbstractControl, FormGroup, FormArray} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-checklist-approval-create',
  templateUrl: './checklist-approval-create.component.html',
  styleUrls: ['./checklist-approval-create.component.scss']
})
export class ChecklistApprovalCreateComponent {

  checked = true;
  disable: boolean = true;
  roleMasterForm:any;
  roleData: any;
  rowData: any;
  reviewData: any;
  id: any;
  roleGetByData: any;
  role_id: any;
  employee_id: any;
  loginUser: any;
  branchData: any;
  dataObj: any = {}; 
  reviews: any;
  constructor(private route:Router, private fb: FormBuilder,private _configurationalMasterService: ConfigurationalmasterService, private _rbacMasterService: RbacMasterService, private activetRoute: ActivatedRoute, private toaster:ToastrService,private location: Location,private _empRegistration: EmpRegistrationService, private _commonService : CommonService, private recruitService: RecruitService) {
    this.roleMasterForm = this.fb.group({
      employee_code: new FormControl(null),
      name: new FormControl(null),
      reporting_manager: new FormControl(null),
      checklist_remark: new FormControl(null),
      // family_details: this.fb.array([]),

    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      var empData: any = localStorage.getItem('signInUser');
      this.loginUser = JSON.parse(empData);
      const singleEmpData = JSON.parse(empData);
      this.employee_id = singleEmpData?.employee_id;
      console.log("sssss",this.employee_id);
      
      this.role_id = this.id.role_master_id
      
    })
    this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
      this.branchData = res.data
    })
    this.getByIdUse();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params['id'];  
      if (this.id) {

        // this.updateAllResignation(this.id);
      }
    });
    this.getActiveCheckList();
    this.getAllResignationList();
    this.allreview();

  }
  get CF_1(): any {
    return this.roleMasterForm.controls;
  };
  get familyDetailsFormArray() {
    return this.roleMasterForm.get('family_details') as FormArray;
  }
  goBack() {
    this.location.back();
  }

  getAllResignationList = () => {
    this._commonService?.showLoader();
    this.recruitService
      .getAllResignationList()
      .subscribe(
        (params: any) => {
          this._commonService?.hideLoader();
          this.rowData = params.data;
          // this.initialize(); 
        },
        (err: any) => {
          this.rowData = [];
          this._commonService?.hideLoader();
        }
      );
  }

  allreview() {
    const id = this.id; // Assuming this is the review ID or some identifier for the data
    this._commonService?.showLoader();
    
    this.recruitService.allreview(id).subscribe(
      (params: any) => {
        this._commonService?.hideLoader();
        this.reviewData = params;

        // Dynamically add each review data into the form array
        this.reviewData.forEach((item: { review: any; status: any; }) => {
          this.reviews.push(
            this.fb.group({
              review: [item.review, Validators.required],
              status: [item.status],
              // checklist_remark: [item.checklist_remark]
            })
          );
        });

        console.log(this.reviewData, 'this.reviewData');
      },
      (err: any) => {
        this.reviewData = [];
        this._commonService?.hideLoader();
      }
    );
  }

  


  getActiveCheckList() {
    this._configurationalMasterService.getActiveCheckList().subscribe((res: any) => {
      
      this.roleData = res.data;
      console.log(this.roleData,'this.roleData<<<<<<<<<<<<<<<<<<<<<<');
      
      // this.initializeForm();
     
    });
  }

  
  // initializeForm() {
  //   const roleFormControls: Record<string, FormControl> = {}; 
    
  //   // Create form controls dynamically for each item
  //   this.roleData.forEach((item: { checklist_name: any; yes: any; no: any; na: any; checklist_remark:any; }, index: string) => {
  //     // roleFormControls['review' + index] = new FormControl(item.checklist_name); 
  //     // roleFormControls['checklist_remark' + index] = new FormControl(item.checklist_remark); 
  //     // roleFormControls['status' + index] = new FormControl(item); 
      
  //   });

  //   this.roleMasterForm = this.fb.group(roleFormControls);
  // }

  // initialize() {
  //   console.log(this.rowData, 'this.rowData<<<<<<<<<<<<<<');
  //   console.log(this.roleData, 'this.roleData<<<<<<<');
  // const modify=this.rowData[0]?.comments;
  // console.log(modify,'modify<<<<<<<<<<<<');
  // const firstArr=this.roleData;
  // firstArr.forEach((item:any, index:any) => {
  //   if (modify[index]) {
  //     item['status_value'] = modify[index].value;
  //   }
  // });
  
//   console.log(firstArr);
//     // Ensure roleData contains the correct structure, then loop through it
//     firstArr?.forEach((item: any, index: number) => {
//       // Push a new FormGroup for each item into the FormArray
//       const formGroup = this.fb.group({
//         review: item?.checklist_name || '',  // Ensure the correct field is being mapped
//         status: item?.status_value,       // Set a default value for status
//         checklist_remark: item?.checklist_remark || ''  // Default empty string for remarks
//       });
      
//       this.familyDetailsFormArray.push(formGroup);
//     });
    
//     console.log(firstArr, '<<<<<<<<<<<<<<<<<');

//     // This part isn't necessary if you're already patching data using the forEach loop above
//     // this.CF_1.family_details = this.patchData(this.roleData);  // You don't need this if you're already patching
  
// }

//    patchData(e: any): FormArray {
//     return new FormArray(
//       e?.map((x: any) => {
//         const obj = new FormGroup({});
//         Object.keys(x).forEach((k) => {
//           obj.addControl(k, new FormControl(x[k]));
//         });
//         return obj;
//       })
//     );
//   };
  getByIdUse() {
    const employee_id =  this.employee_id; 
    this._empRegistration.getByUserId(employee_id).subscribe((res: any) => {
      this.dataObj = res.data;
      console.log("sss",this.dataObj);
      
    });
  }

  roleSubmitForm() {
    const data = this.reviewData.map((item:  any) => ({
      checklist_remark: item.checklist_remark ,
      id : item.id
    }));
  // let payload ={

  //   ...data,

  // }
  //   console.log('reviewData:', payload);
  
// return
    this.recruitService.updateAllResignation(this.id, data).subscribe(
      (res: any) => {
     
        this.toaster.success('Created');
        this.route.navigate(['/master/ess/checklist-approval/approved-checklist'])
      },
      (error) => {
        // Handle error response
        console.error('Error occurred:', error);
      }
    );
  }


 

  back(){
    this.route.navigate(['/master/hrms/all-resignation'])
  }

}
