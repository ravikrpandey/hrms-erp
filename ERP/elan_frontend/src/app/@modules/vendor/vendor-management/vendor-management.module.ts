import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorManagementRoutingModule } from './vendor-management-routing.module';
import { VendorManagementComponent } from './vendor-management.component';
import { ShairedModule } from "src/app/@shared/shaired/shaired.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { TdsSectionsComponent } from './tds-sections/tds-sections.component';

@NgModule({
    declarations: [
        VendorManagementComponent,
        TdsSectionsComponent
    ],
    imports: [
        CommonModule,
        VendorManagementRoutingModule,
        ShairedModule,
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
        
    ]
})
export class VendorManagementModule { }
