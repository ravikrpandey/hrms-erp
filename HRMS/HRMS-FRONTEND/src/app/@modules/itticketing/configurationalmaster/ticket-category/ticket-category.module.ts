import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TicketCategoryRoutingModule } from './ticket-category-routing.module';
import { TicketCategoryComponent } from './ticket-category.component';
import { AgGridModule } from 'ag-grid-angular';
import { ActionCellRenderer } from './action-cell-renderer/action-cell-renderer.component';
import { TicketManagementRoutingModule } from 'src/app/@modules/ticket-management/ticket-management-routing.module';
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
import { ActionComponent } from './action/action.component';
import { TicketCategoryDialogComponent } from './ticket-category-dialog/ticket-category-dialog.component';
@NgModule({
  declarations: [
    TicketCategoryComponent,
    ActionCellRenderer,
    ActionComponent,
    TicketCategoryDialogComponent
  ],
  imports: [
    CommonModule,
    TicketCategoryRoutingModule,
    MatSlideToggleModule,
    AgGridModule,
    CommonModule,
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
export class TicketCategoryModule { }
