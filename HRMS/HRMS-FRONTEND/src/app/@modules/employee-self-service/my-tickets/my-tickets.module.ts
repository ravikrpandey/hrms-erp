import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTicketsRoutingModule } from './my-tickets-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MyTicketsComponent } from './my-tickets.component';
import { AllocatedTicketsComponent } from './allocated-tickets/allocated-tickets.component';
import { MyticketComponent } from './myticket/myticket.component';
import { ActionComponent } from './myticket/action/action.component';
import { CreateMyTicketComponent } from './myticket/create-my-ticket/create-my-ticket.component';
import { CreateAllocatedTicketComponent } from './create-allocated-ticket/create-allocated-ticket.component';
import { AllocatedTicketActionComponent } from './allocated-ticket-action/allocated-ticket-action.component';

@NgModule({
  declarations: [
    MyTicketsComponent,
    MyticketComponent,
    AllocatedTicketsComponent,
    ActionComponent,
    CreateMyTicketComponent,
    CreateAllocatedTicketComponent,
    AllocatedTicketActionComponent
  ],
  imports: [
    CommonModule,
    MyTicketsRoutingModule,
    MatSlideToggleModule,
    AgGridModule,
    MaterialModule,
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
  ]
})
export class MyTicketsModule { }
