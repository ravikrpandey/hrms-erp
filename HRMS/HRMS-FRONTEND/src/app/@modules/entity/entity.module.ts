import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityRoutingModule } from './entity-routing.module';
import { EntityComponent } from './entity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AddEntityComponent } from './add-entity/add-entity.component';
import { EntityActionComponent } from './entity-action/entity-action.component';
import { ShairedModule } from "../../@shared/shaired/shaired.module";
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityStatusComponent } from './entity-status/entity-status.component';
import { EntityLogoComponent } from './entity-logo/entity-logo.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RequestInterceptor } from './request.interceptor';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@NgModule({
    declarations: [
        EntityComponent,
        AddEntityComponent,
        EntityActionComponent,
        EntityListComponent,
        EntityStatusComponent,
        EntityLogoComponent
    ],
    imports: [
        CommonModule,
        EntityRoutingModule,
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
        ShairedModule,
        SearchFilterComponent
    ],
      providers: [
        PayrollService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true  
        },
        
      ]
    

})
export class EntityModule { }
