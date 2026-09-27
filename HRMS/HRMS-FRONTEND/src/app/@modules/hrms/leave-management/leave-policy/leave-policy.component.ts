import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-policy',
  templateUrl: './leave-policy.component.html',
  styleUrls: ['./leave-policy.component.scss']
})
export class LeavePolicyComponent {


  active = true;
  sharedData = 'some data'; // Replace with your actual data


constructor( ){
  
}


// constructor(  @Inject(MAT_DIALOG_DATA) public data: { leaveId: number }, ){
//   console.log('this.data.leaveId       === >',this.data.leaveId);
  
// }




routeDetails(){
  // this.router.navigate(['/master/hrms/leave-management/leave-policy/leave-restrictions', this.routeLeaveId]);
}



routeEntitlement(){
  
}



routeApplicability(){
  
}



routerRestrictions(){
  
}







  
}
