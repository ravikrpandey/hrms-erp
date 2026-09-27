import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { RecuitmentModuleRoutingModule } from './recuitment-module-routing.module';
import { RecuitmentModuleComponent } from './recuitment-module.component';
import { JobDescriptionModule } from './job-description/job-description.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CKEditorModule } from 'ckeditor4-angular';
import { BackgroundVarificationModule } from './background-varification/background-varification.module';
import { CandidateProfileModule } from './candidate-profile/candidate-profile.module';
import { CandidateShortlistModule } from './candidate-shortlist/candidate-shortlist.module';
import { FixedInterviewModule } from './fixed-interview/fixed-interview.module';
import { InterviewStatusModule } from './interview-status/interview-status-varification.module';
import { PostVacancyOpeningModule } from './post-vacancy-opening/post-vacancy-opening.module';
import {MatDialogModule} from '@angular/material/dialog';
import { FilterPipe } from 'src/app/@shared/pipe/filter.pipe';
import { AllCandidateListComponent } from './all-candidate-list/all-candidate-list.component';
import { OnBoardingModule } from './on-boarding/on-boarding.module'
import { HrDashboardListModule } from './hr-dashboard/hr-dashboard.module';
import { RequestNewPositionModule } from './request-new-position/request-new-position.module';
import { ShairedModule } from "src/app/@shared/shaired/shaired.module";
import { SidebarMenuComponent } from 'src/app/@shared/sidebar-menu/sidebar-menu.component';
// import { HrDashboardListModule } from './hr-dashboard/hr-dashboard.module';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
@NgModule({
    declarations: [
        RecuitmentModuleComponent,
        AllCandidateListComponent,
    ],
    imports: [
        CommonModule,
        RecuitmentModuleRoutingModule,
        JobDescriptionModule,
        CandidateProfileModule,
        CandidateShortlistModule,
        FixedInterviewModule,
        InterviewStatusModule,
        MaterialModule,
        // HrDashboardListModule,
        AgGridModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        CKEditorModule,
        BackgroundVarificationModule,
        MatCardModule,
        PostVacancyOpeningModule,
        MatDialogModule,
        OnBoardingModule,
        RequestNewPositionModule,
        ShairedModule,
        SearchFilterComponent
    ]
})
export class RecuitmentModuleModule { }
