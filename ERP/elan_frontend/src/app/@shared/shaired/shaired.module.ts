import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { EmailSendeComponent } from '../components/email-sende/email-sende.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { VendorSidebarMenuComponent } from '../vendor-sidebar-menu/vendor-sidebar-menu.component';
import { VendorHeaderComponent } from '../vendor-header/vendor-header.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { MatFormSelectFilterComponent } from '.././components/widgets/mat-form-select-filter/mat-form-select-filter.component';
import { WrapperComponent } from '../components/widgets/wrapper/wrapper.component';
import { DashTravelJourneyComponent } from '../components/widgets/dialog/dash-travel-journey/dash-travel-journey.component';
import { DashCreateTravelRequestComponent } from '../components/widgets/dialog/dash-create-travel-request/dash-create-travel-request.component';
import { TravelRequestModule } from 'src/app/@modules/employee-self-service/travelrequest/travelrequest.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TitleSelectComponent } from '../components/title-select/title-select.component';
import { TravelPlanDialogComponent } from '../components/widgets/dialog/travel-plan-dialog/travel-plan-dialog.component';
import { TravelPlanListComponent } from '../components/widgets/dialog/travel-plan-dialog/travel-plan-list/travel-plan-list.component';
import { HeaderComponent } from '../components/widgets/header/header.component';
import { PurchaseFormComponent } from '../components/widgets/purchase-form/purchase-form.component';
import { PurchaseRfpFormComponent } from '../components/widgets/purchase-rfp-form/purchase-rfp-form.component';
import { QuickModalComponent } from '../components/widgets/quick-modal/quick-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    SidebarMenuComponent,
    EmailSendeComponent,
    VendorSidebarMenuComponent,
    VendorHeaderComponent,
    AccessDeniedComponent,
    MatFormSelectFilterComponent,
    WrapperComponent,
    DashTravelJourneyComponent,
    DashCreateTravelRequestComponent,
    TitleSelectComponent,
    TravelPlanListComponent,
    TravelPlanDialogComponent,
    HeaderComponent,
    PurchaseFormComponent,
    PurchaseRfpFormComponent,
    QuickModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    ScrollingModule,
    DragDropModule
  ],
  exports: [
    SidebarMenuComponent,
    EmailSendeComponent,
    VendorHeaderComponent,
    VendorSidebarMenuComponent,
    AccessDeniedComponent,
    MatFormSelectFilterComponent,
    WrapperComponent,
    DashTravelJourneyComponent,
    DashCreateTravelRequestComponent,
    TitleSelectComponent,
    TravelPlanDialogComponent,
    TravelPlanListComponent,
    HeaderComponent,
    PurchaseFormComponent,
    PurchaseRfpFormComponent,
    QuickModalComponent,
    DragDropModule
  ],
})
export class ShairedModule { }
