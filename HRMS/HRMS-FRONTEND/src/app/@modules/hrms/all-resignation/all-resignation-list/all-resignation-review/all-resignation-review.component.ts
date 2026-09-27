import { Component } from '@angular/core';
import { FormBuilder,FormControl,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Location } from '@angular/common';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-all-resignation-review',
  templateUrl: './all-resignation-review.component.html',
  styleUrls: ['./all-resignation-review.component.scss']
})
export class AllResignationReviewComponent {
  checked = true;
  roleMasterForm: any;
  disable: boolean = true;
  roleData: any;
  id: any;
  roleGetByData: any;
  role_id: any;
  employee_id: any;
  loginUser: any;
  branchData: any;
  reporting_id:any;
  Data: any[] = [];
  dataObj: any = {}; 
  constructor(private route:Router, private fb: FormBuilder,private _configurationalMasterService: ConfigurationalmasterService, private _rbacMasterService: RbacMasterService, private activetRoute: ActivatedRoute, private toaster:ToastrService,private location: Location, private _empRegistration: EmpRegistrationService,  private recruitService: RecruitService, private activeroute: ActivatedRoute) {
    this.roleMasterForm = this.fb.group({
      review: new FormControl(null),
      myControl: new FormControl(null),
      // no: new FormControl(null),
      // na: new FormControl(null),
      // branch_id: new FormControl(null, [Validators.required])
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
      this.role_id = this.id.role_master_id
      
    })
    this.getActiveCheckList();
    this.getByIdUse();



    // this._configurationalMasterService.getListBranchSetup(query).subscribe((res: any) => {
    //   this.branchData = res.data
    // })
   
  }
  goBack() {
    this.location.back();
  }

  submit() {
    let feedbacks: any[] = []; // This array will store both reviews and comments as objects
  
    let val = this.roleMasterForm.value;
    let reviewObject = val;

  
    for (let key in reviewObject) {
      if (reviewObject.hasOwnProperty(key)) {
        const index: any = key.match(/\d+/); // Extract the index from the key
  
        if (index) {
          if (key.startsWith('review')) {
            // Store reviews and corresponding comments together
            const commentKey = 'comments' + index[0]; // Construct the corresponding comment key
            const commentValue = reviewObject[commentKey] || ''; // Get the comment value if exists
  
            feedbacks.push({
              review: reviewObject[key],
              comment: commentValue
            });
          }
        }
      }
    }
  
    // console.log('Feedbacks Array:', feedbacks);
  
    const data = {
      resignnation_id: this.id.id,
      reporting_manager_id:this.id.reporting_id,
      employee_id: this.dataObj?.employee_id,
      name: this.dataObj?.first_name + " " + this.dataObj?.last_name,
      employee_number: this.dataObj?.employee_code,
      reporting_manager: this.dataObj?.reporting_manager,
      feedbacks: feedbacks, 
    };

    if (this.roleMasterForm.invalid) {
      this.toaster.error('Required fields should not be blank', 'Required fields');
      return;
    }
  
    this.recruitService.createAllResignation(data,this.id.id).subscribe(
      (res: any) => {
        this.toaster.success('Created');
        this.route.navigate(['/master/hrms/all-resignation/all-resignation']);
      },
      (err) => {
        if (err.status == 409) {
          this.toaster.error("You have already applied for this employee resignation");
        }
      }
    );
  }
  

   getByIdUse() {
    this._empRegistration.getByUserId( this.id.employee_id).subscribe((res: any) => {
      this.dataObj = res.data;
      
    });
  }

   getActiveCheckList() {
    this._configurationalMasterService.getActiveCheckList().subscribe((res: any) => {
      this.roleData = res.data;
      this.initializeForm();
     
    });
  }
  
  initializeForm() {
    const roleFormControls: Record<string, FormControl> = {}; 
    
  
    this.roleData.forEach((item: { checklist_name: any; yes: any; no: any; na: any; }, index: string) => {
      roleFormControls['review' + index] = new FormControl(item.checklist_name); 
      roleFormControls['comments' + index] = new FormControl(item); 
      
    });

  
    this.roleMasterForm = this.fb.group(roleFormControls);
  }
  

  back(){
    this.route.navigate(['/master/hrms/all-resignation'])
  }

}
