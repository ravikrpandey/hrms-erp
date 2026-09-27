import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing-module';
import { Reports } from './reports';
import { HeaderComponent } from 'src/app/@shared/header/header.component';
import { FooterComponent } from 'src/app/@shared/footer/footer.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

@NgModule({
  declarations: [Reports],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    ShairedModule,
    FormsModule,
    SearchFilterComponent,
  ],
  exports: [],
})
export class ReportsModule {}
