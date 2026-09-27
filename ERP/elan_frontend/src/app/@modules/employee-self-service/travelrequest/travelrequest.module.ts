import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionsComponent } from './actions/actions.component';
import { AgGridModule } from 'ag-grid-angular';
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
import { TravelRequestListComponent } from './travelrequestlist.component';
import { TravelRequestRoutingModule } from './travelrequest-routing.module';
import { AddTravelRequestComponent } from './add-travel-request/add-travel-request.component';
import { AddDomesticDialogueComponent } from './add-travel-request/add-domestic-dialogue/add-domestic-dialogue.component';
import { AddInternationalDialogueComponent } from './add-travel-request/add-international-dialogue/add-international-dialogue.component';
import { TravelWorkflowLevelDialogComponent } from './travel-workflow-level/travel-workflow-level-dialog.component';
import { RemarkDilogComponent } from './add-travel-request/remark-dilog/remark-dilog.component';
import { AdvancedBookingDialogueComponent } from './add-travel-request/advanced-booking-dialogue/advanced-booking-dialogue.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

@NgModule({
  declarations: [
    ActionsComponent,
    TravelRequestListComponent,
    AddTravelRequestComponent,
    AddDomesticDialogueComponent,
    AddInternationalDialogueComponent,
    TravelWorkflowLevelDialogComponent,
    RemarkDilogComponent,
    AdvancedBookingDialogueComponent
  ],
  imports: [
    CommonModule,
    TravelRequestRoutingModule,
    MaterialModule,
    AgGridModule,
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
    MatTooltipModule,
    ShairedModule
  ],
  exports: [AddDomesticDialogueComponent]
})
export class TravelRequestModule { }
