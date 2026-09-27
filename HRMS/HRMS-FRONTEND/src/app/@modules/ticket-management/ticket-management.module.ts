import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketManagementRoutingModule } from './ticket-management-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TicketMangmentComponent } from './ticket-mangment/ticket-mangment.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AllocatedTicketsComponent } from './allocated-tickets/allocated-tickets.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { ActionCellRenderer } from './action-cell-renderer/action-cell-renderer.component';

import { ModalContentComponentComponent } from './modal-content-component/modal-content-component.component';
@NgModule({
  declarations: [
    DashboardComponent,
    AllocatedTicketsComponent,
    TicketListComponent,
    TicketMangmentComponent,
    ActionCellRenderer,
    ModalContentComponentComponent
  ],
  imports: [
    CommonModule,
    TicketManagementRoutingModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatIconModule,
    MatButtonModule,
    
  ],
  exports: [ActionCellRenderer],
})
export class TicketManagementModule { }
