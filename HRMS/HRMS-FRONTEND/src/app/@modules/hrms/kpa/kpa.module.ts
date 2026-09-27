import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpaRoutingModule } from './kpa-routing.module';
import { KpaListComponent } from './kpa-list/kpa-list.component';
import { KpaActionComponent } from './kpa-action/kpa-action.component';
import { KpaStatusComponent } from './kpa-status/kpa-status.component';
import { CreateKpaComponent } from './create-kpa/create-kpa.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HrmsModule } from '../hrms.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
// import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [
    KpaListComponent,
    KpaActionComponent,
    KpaStatusComponent,
    CreateKpaComponent
  ],
  imports: [
    CommonModule,
    KpaRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    CKEditorModule,
    SearchFilterComponent
  ]
})
export class KpaModule { }
