import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComplainComponent } from './register-complain.component';
import { AddRegisterCompalinComponent } from './add-register-compalin/add-register-compalin.component';

const routes: Routes = [
  { path:'', component: RegisterComplainComponent},
  { path:'addregister-compain', component: AddRegisterCompalinComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterComplainRoutingModule { }
