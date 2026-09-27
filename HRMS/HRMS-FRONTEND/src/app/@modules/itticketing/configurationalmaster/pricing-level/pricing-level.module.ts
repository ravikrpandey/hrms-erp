import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingLevelRoutingModule } from './pricing-level-routing.module';
import { PricingLevelComponent } from './pricing-level.component';
import { PricinglevelDialogComponent } from './pricinglevel-dialog/pricinglevel-dialog.component';
import { ActionComponent } from './action/action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    PricingLevelComponent,
    PricinglevelDialogComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    PricingLevelRoutingModule,  
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    AgGridModule
  ]
})
export class PricingLevelModule { }
