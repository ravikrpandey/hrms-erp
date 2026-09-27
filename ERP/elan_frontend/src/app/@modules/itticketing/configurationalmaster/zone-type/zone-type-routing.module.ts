import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubcategoryComponent } from '../subcategory/subcategory.component';
import { SubcategoryCreateComponent } from '../subcategory/subcategory-create/subcategory-create.component';
import { ZoneTypeComponent } from './zone-type.component';
import { CreateZoneTypeComponent } from './create-zone-type/create-zone-type.component';

const routes: Routes = [
  { path: "", component: ZoneTypeComponent},
  { path: "create-zone", component: CreateZoneTypeComponent},
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ZoneTypeRoutingModule { }
