import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { Location } from '@angular/common';

interface QueryParams {
  leaveId?: string;
  mode?: string;
}

@Component({
  selector: 'app-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.scss']
})


export class PolicyInformationComponent implements OnInit {

  active: boolean = true;
  routeLeaveId: any;
  action_type: boolean = true;
  mode: string | undefined;
  activeButton: string;
  message: string;

  constructor(
    private fb: FormBuilder, private router: Router,
    private leaveManagementService: LeaveManagementService,
    private activeroute: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location
  ) {



    //  Fetching leaveID from the params
    // this.activeroute.params.subscribe((params:this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.edited_ID, action_type: 'view' } })



    this.activeroute.queryParams.subscribe(params => {
      const queryParams: QueryParams = params;
      this.routeLeaveId = queryParams.leaveId;
      this.mode = queryParams.mode;
      // console.log("routeLeaveId===>", this.routeLeaveId);
      // console.log("mode===>", this.mode);
    });


  }




  ngOnInit() {
    this.leaveManagementService.currentMessage.subscribe((message: string) => {
      // console.log('message',message);      
      this.message = message;

      this.activeButton = message;
    }
    );
  }


  goToPolicyDetails(buttonName: string) {
    // console.log('BUTTON NAME:', buttonName, 'MODE:', this.mode);

    if (this.mode === 'editMode' || 'viewMode') {
      this.activeButton = buttonName;
      this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-details'],
        { queryParams: { leaveId: this.routeLeaveId, mode: this.mode } })

    }

  }


  goToPolicyEntitlement(buttonName: string) {
    // console.log('BUTTON NAME:', buttonName, 'MODE:', this.mode);

    if (this.mode === 'editMode' || 'viewMode') {
      this.activeButton = buttonName;
      this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-entitlement'],
        { queryParams: { leaveId: this.routeLeaveId, mode: this.mode } })
    }

  }


  goToPolicyApplicability(buttonName: string) {
    // console.log('BUTTON NAME:', buttonName, 'MODE:', this.mode);

    if (this.mode === 'editMode' || 'viewMode') {
      this.activeButton = buttonName;
      this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-applicability'],
        { queryParams: { leaveId: this.routeLeaveId, mode: this.mode } })
    }



  }

  goToPolicyRestrictions(buttonName: string) {
    // console.log('BUTTON NAME:', buttonName, 'MODE:', this.mode);

    if (this.mode === 'editMode' || 'viewMode') {
      this.activeButton = buttonName;
      this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-restrictions'],
        { queryParams: { leaveId: this.routeLeaveId, mode: this.mode } });
    }
  }

  goBack() {
    this.router.navigate(['master/hrms/leave-management/leave-policy'])
    // this.location.back();
  }

}
