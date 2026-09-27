import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';

@NgModule({
  declarations: [UsersComponent, CreateUserDialogComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ShairedModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class UsersModule {}
