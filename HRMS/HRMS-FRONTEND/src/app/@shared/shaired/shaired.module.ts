import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { EmailSendeComponent } from '../components/email-sende/email-sende.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { WrapperComponent } from '../components/wrapper/wrapper.component';
import { MatFormSelectFilterComponent } from '../components/mat-form-select-filter/mat-form-select-filter.component';
import { DashCreateTravelRequestComponent } from '../components/dialog/dash-create-travel-request/dash-create-travel-request.component';
import { DashTravelJourneyComponent } from '../components/dialog/dash-travel-journey/dash-travel-journey.component';
import { TravelPlanListComponent } from '../components/dialog/travel-plan-dialog/travel-plan-list/travel-plan-list.component';
import { TravelPlanDialogComponent } from '../components/dialog/travel-plan-dialog/travel-plan-dialog.component';
import { SearchFilterComponent } from '../components/search-filter/search-filter.component';

// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    SidebarMenuComponent,
    EmailSendeComponent,
    WrapperComponent,
    MatFormSelectFilterComponent,
    DashCreateTravelRequestComponent,
    DashTravelJourneyComponent,
    TravelPlanListComponent,
    TravelPlanDialogComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    SearchFilterComponent 
  ],
  exports:[
    SidebarMenuComponent,
    EmailSendeComponent,
    WrapperComponent,
    MatFormSelectFilterComponent,
    DashCreateTravelRequestComponent,
    DashTravelJourneyComponent,
    SearchFilterComponent 
  ]
})
export class ShairedModule { }