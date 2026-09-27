import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuManagementRoutingModule } from './menu-management-routing.module';
import { ListingMenuComponent } from './listing-menu/listing-menu.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MenuManagementComponent } from './menu-management.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuListCardComponent } from './menu-list-card/menu-list-card.component';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';


@NgModule({
  declarations: [
    ListingMenuComponent,
    MenuManagementComponent,
    MenuListCardComponent,
    MenuDialogComponent
  ],
  imports: [
    CommonModule,
    MenuManagementRoutingModule,
    ShairedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MenuManagementModule { }
