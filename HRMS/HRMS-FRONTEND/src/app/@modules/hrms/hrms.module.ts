import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmsRoutingModule } from './hrms-routing.module';
import { HrmsComponent } from './hrms.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AppModule } from "../../app.module";
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { AuthModule } from 'src/app/@auth/auth.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/@shared/header/header.component';
import { FooterComponent } from 'src/app/@shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { DocumentManagementModule } from './document-management/document-management-module';
import { DeductionRuleList } from './deduction-rules/deduction-rule-list/deduction-rule-list';
import { DeductionRules } from './deduction-rules/deduction-rules';
import { ActionDeductionRules } from './deduction-rules/deduction-rule-list/action-deduction-rules/action-deduction-rules';
import { AttendanceWorkingHours } from './attendance-working-hours/attendance-working-hours';
import { ViewAttendanceWorkingHours } from './view-attendance-working-hours/view-attendance-working-hours';



@NgModule({
    declarations: [
        HrmsComponent,
        HeaderComponent,
        FooterComponent,
        LeaveManagementComponent,
        DeductionRuleList,
        DeductionRules,
        ActionDeductionRules,
        AttendanceWorkingHours,
        ViewAttendanceWorkingHours
        
    ],
    imports: [
        CommonModule,
        HrmsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        AgGridModule,
        CKEditorModule,
        ShairedModule,
        FormsModule,
        SearchFilterComponent,
        DocumentManagementModule
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ]
  
})
export class HrmsModule { }
