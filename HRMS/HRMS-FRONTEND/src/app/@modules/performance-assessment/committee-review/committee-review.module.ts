import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HrmsModule } from '../../hrms/hrms.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActionComponent } from './committee-review-action/action.component';
import { CommitteeReviewListComponent } from './committee-review-list/committee-review-list.component';
import { SendCommitteeReviewComponent } from './send-committee-review/send-committee-review.component'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CommitteeReviewRoutingModule } from './committee-review-routing.module'
@NgModule({
  declarations: [
    CommitteeReviewListComponent,
    SendCommitteeReviewComponent,
    ActionComponent,
  ],
  imports: [
    CommonModule,
    CommitteeReviewRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    CKEditorModule
  ]
})
export class CommitteeReviewModule { }
