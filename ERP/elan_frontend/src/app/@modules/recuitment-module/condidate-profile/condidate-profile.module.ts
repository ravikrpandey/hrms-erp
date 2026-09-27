import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CondidateProfileRoutingModule } from './condidate-profile-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CondidateProfileListComponent } from './condidate-profile-list/condidate-profile-list.component';
import { CondidateProfileAction } from './condidate-profile-action/condidate-profile-action.component';
import { ProfileRequestComponent } from './profile-request/profile-request.component';
import { ProfileRequestActionComponent } from './profile-request-action/profile-request-action.component';
import { ActionStatusChangeComponent } from './actions/actions.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { InterviewScheduleDialogComponent } from './interview-schedule-dialog/interview-schedule-dialog.component';
import { ViewInterviewDetailsComponent } from './view-interview-details/view-interview-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InterviewRoundStatusDialogComponent } from './interview-round-status-dialog/interview-round-status-dialog.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { InterviewerStatusDialogComponent } from './interviewer-status-dialog/interviewer-status-dialog.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchProfileComponent } from './search-profile/search-profile.component';
import { SearchProfileActionComponent } from './search-profile/search-profile-action/search-profile-action.component';

@NgModule({
  declarations: [
    CondidateProfileListComponent,
    CondidateProfileAction,
    ProfileRequestComponent,
    ProfileRequestActionComponent,
    ActionStatusChangeComponent,
    AddProfileComponent,
    InterviewScheduleDialogComponent,
    ViewInterviewDetailsComponent,
    InterviewRoundStatusDialogComponent,
    InterviewerStatusDialogComponent,
    SearchProfileComponent,
    SearchProfileActionComponent,
  ],
  imports: [
    NgxIntlTelInputModule,
    CommonModule,
    CondidateProfileRoutingModule,
    AgGridModule,
    MaterialModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatStepperModule,
    MatSelectFilterModule,
    MatExpansionModule,
    NgxMatTimepickerModule
  ],
})
export class CondidateProfileModule { }
