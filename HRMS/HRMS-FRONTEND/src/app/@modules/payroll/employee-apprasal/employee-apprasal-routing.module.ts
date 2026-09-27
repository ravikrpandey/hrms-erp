import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeApprasalComponent } from './employee-apprasal.component';
import { AllEmployessListComponent } from './all-employess-list/all-employess-list.component';
import { MyRequestListComponent } from './my-request-list/my-request-list.component';
import { ApprovedListEmpComponent } from './approved-list-emp/approved-list-emp.component';
import { RejectListEmpComponent } from './reject-list-emp/reject-list-emp.component';
import { PendingApprovelEmpComponent } from './pending-approvel-emp/pending-approvel-emp.component';
import { UpdateApprisalEmpComponent } from './update-apprisal-emp/update-apprisal-emp.component';

const routes: Routes = [
  {path:'',component:EmployeeApprasalComponent,
children:[
  {path:"",redirectTo:"all-employee-list",pathMatch:'full'},
  {path:"all-employee-list",component:AllEmployessListComponent},
  {path:"my-request-employee",component:MyRequestListComponent},
  {path:"pending-approved-emp",component:PendingApprovelEmpComponent},

  {path:"approved-list-emp",component:ApprovedListEmpComponent},
  {path:"reject-list-emp",component:RejectListEmpComponent}

]
},
{path:'update-apprisal-emp', component:UpdateApprisalEmpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeApprasalRoutingModule { }
