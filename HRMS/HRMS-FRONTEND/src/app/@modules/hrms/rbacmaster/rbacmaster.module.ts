import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RbacmasterRoutingModule } from './rbacmaster-routing.module';
import { RbacmasterComponent } from './rbacmaster.component';
import { RbacRoleMasterModule } from './rbac-role-master/rbac-role-master.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    RbacmasterComponent
  ],
  imports: [
    CommonModule,
    RbacmasterRoutingModule,
    RbacRoleMasterModule,
    AgGridModule,
    FormsModule,
    MaterialModule, 
    SearchFilterComponent
  ]
})
export class RbacmasterModule { }
