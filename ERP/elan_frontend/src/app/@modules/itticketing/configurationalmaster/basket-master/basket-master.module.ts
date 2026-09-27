import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BasketMasterRoutingModule } from './basket-master-routing.module';
import { BasketMasterComponent } from './basket-master.component';
import { BasketMasterCreateComponent } from './basket-master-create/basket-master-create.component';
import { BasketMasterActionComponent } from './basket-master-action/basket-master-action.component';
import { SharedModule } from 'src/app/@shared/shared.module';

// import { LocationMasterComponent } from './basket-master.component';
// import { LocationMasterCreateComponent } from './location-master-create/location-master-create.component';
// import { LocationMasterActionComponent } from './location-master-action/location-master-action.component';


@NgModule({
  declarations: [
    // LocationMasterComponent,
    // LocationMasterCreateComponent,
    // LocationMasterActionComponent
    BasketMasterComponent,
    BasketMasterCreateComponent,
    BasketMasterActionComponent
  ],
  imports: [
    CommonModule,
    BasketMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    SharedModule
  ]
})
export class BasketMasterModule { }
