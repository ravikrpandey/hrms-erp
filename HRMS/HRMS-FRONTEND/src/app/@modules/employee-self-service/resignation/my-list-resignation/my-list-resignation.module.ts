import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

;
import { AgGridModule } from 'ag-grid-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MyListResignationRoutingModule } from './my-list-resignation-routing.module';
import { MyListCreateComponent } from './my-list-create/my-list-create.component';
import { MyListDialogComponent } from './my-list-dialog/my-list-dialog.component';
import { MyResignationListComponent } from './my-resignation-list/my-resignation-list.component';
import { MyListRemarkComponent } from './my-list-remark/my-list-remark.component';
import { ListActionComponent } from './list-action/list-action.component';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ComplaintModule } from '../../complaint/complaint.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgImageSliderModule } from 'ng-image-slider';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    MyListCreateComponent,
    MyListDialogComponent,
    MyResignationListComponent,
    MyListRemarkComponent,
    ListActionComponent
  ],
  imports: [
    CommonModule,
    MyListResignationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    MatSelectFilterModule,
    ReactiveFormsModule,    
    MatFormFieldModule,    
    MatInputModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    FullCalendarModule,
    NgImageSliderModule,
    IvyCarouselModule,
    MatExpansionModule, 
    MatSelectFilterModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    ShairedModule,
   
  ]
})
export class MyListResignationModule { }
