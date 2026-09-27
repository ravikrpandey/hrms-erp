import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDeclarationRoutingModule } from './upload-declaration-routing.module';
import { UploadDeclarationListComponent } from './upload-declaration-list/upload-declaration-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadDeclarationCreateComponent } from './upload-declaration-create/upload-declaration-create.component';
import { UploadDeclarationActionComponent } from './upload-declaration-action/upload-declaration-action.component';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { AllTabsModule } from './all-tabs/all-tabs-module';


@NgModule({
  declarations: [
    UploadDeclarationListComponent,
    UploadDeclarationCreateComponent,
    UploadDeclarationActionComponent
  ],
  imports: [
    CommonModule,
    UploadDeclarationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AllTabsModule
  ],
  providers: [
    PayrollService,
    
  ]
})
export class UploadDeclarationModule { 

}
