import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageMasterRoutingModule } from './language-master-routing.module';
import { LanguageMasterComponent } from './language-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { LaactionLangComponent } from './laaction-lang/laaction-lang.component';
import { LangDailogComponent } from './lang-dailog/lang-dailog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { LanguageStatusComponent } from './laaction-lang/language-status/language-status.component';

@NgModule({
  declarations: [
    LanguageMasterComponent,
    LaactionLangComponent,
    LangDailogComponent,
    LanguageStatusComponent
  ],
  imports: [
    CommonModule,
    LanguageMasterRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class LanguageMasterModule { }
