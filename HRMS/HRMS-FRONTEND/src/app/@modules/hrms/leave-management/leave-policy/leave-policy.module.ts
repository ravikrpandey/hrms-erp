import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LeavePolicyRoutingModule } from './leave-policy-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveApplicabilityComponent } from './leave-applicability/leave-applicability.component';
import { LeaveRestrictionsComponent } from './leave-restrictions/leave-restrictions.component';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';
import { LeaveEntitlementComponent } from './leave-entitlement/leave-entitlement.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { PolicyStatusComponent } from './policy-status/policy-status.component';
import { PolicyActionsComponent } from './policy-actions/policy-actions.component';
import { PolicyInformationComponent } from './policy-information/policy-information.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    LeaveDetailsComponent,
    LeaveEntitlementComponent,
    LeaveApplicabilityComponent,
    LeaveRestrictionsComponent,
    PolicyListComponent,
    PolicyActionsComponent,
    PolicyStatusComponent,
    PolicyInformationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LeavePolicyRoutingModule,
    ReactiveFormsModule, 
    FormsModule ,
    MatButtonModule,
    MatSelectFilterModule,
    MaterialModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    AgGridModule,
    SearchFilterComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})


export class LeavePolicyModule { }
