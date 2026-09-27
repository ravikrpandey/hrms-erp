import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DeclarationFormRoutingModule } from './declaration-form-routing.module';
import { DeclarationFormListComponent } from './declaration-form-list/declaration-form-list.component';
import { DeclarationFormActionComponent } from './declaration-form-action/declaration-form-action.component';
import { DeclarationFormDialogComponent } from './declaration-form-dialog/declaration-form-dialog.component';
import { DeclarationMainComponent } from './declaration-main.component';
import { UpdateDeclarationComponent } from './update-declaration/update-declaration.component';
import { ApprovedDeclarationListComponent } from './approved-declaration-list/approved-declaration-list.component';
import { RejectDeclarationListComponent } from './reject-declaration-list/reject-declaration-list.component';
import { UploadDeclarationCreateComponent } from './upload-declaration-create/upload-declaration-create.component';

@NgModule({
  declarations: [
    DeclarationMainComponent,
    DeclarationFormListComponent,
    DeclarationFormActionComponent,
    DeclarationFormDialogComponent,
    UpdateDeclarationComponent,
    ApprovedDeclarationListComponent,
    RejectDeclarationListComponent,
    UploadDeclarationCreateComponent
    
  ],
  imports: [
    CommonModule,
    DeclarationFormRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DeclarationFormModule { }
