import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleAssignRoutingModule } from './role-assign-routing.module';
import { RoleAssignAdminUserComponent } from './role-assign-admin-user/role-assign-admin-user.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionsComponent } from './actions/actions.component';

@NgModule({
  declarations: [
    RoleAssignAdminUserComponent,
    ActionsComponent
  ],
  imports: [
    CommonModule,
    RoleAssignRoutingModule,
    AgGridModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule
    
  ]
})
export class RoleAssignModule { }
