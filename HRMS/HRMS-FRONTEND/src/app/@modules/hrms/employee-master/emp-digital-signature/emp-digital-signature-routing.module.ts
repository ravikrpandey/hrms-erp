import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpDigitalSignatureComponent } from './emp-digital-signature.component';
import { CreateDigitalSignatureComponent } from './create-digital-signature/create-digital-signature.component';

const routes: Routes = [
  { 
    path: '', component: EmpDigitalSignatureComponent
   },
   {
       path: 'create', component: CreateDigitalSignatureComponent,
   },
   {
    path: 'edit/:id',
    component: CreateDigitalSignatureComponent, // Same component for both
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpDigitalSignatureRoutingModule { }
