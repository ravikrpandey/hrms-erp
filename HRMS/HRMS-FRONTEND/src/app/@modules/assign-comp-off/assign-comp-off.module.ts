import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignCompOffRoutingModule } from './assign-comp-off-routing.module';
import { AssignCompOffComponent } from './assign-comp-off/assign-comp-off.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
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
import { AssignCompOffListComponent } from './assign-comp-off-list/assign-comp-off-list.component';
import { CompOffFormComponent } from './comp-off-form/comp-off-form.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { AssignCompActionComponent } from './assign-comp-action/assign-comp-action.component';
import { CompOffDialogComponent } from './comp-off-dialog/comp-off-dialog.component';
import { CompOffListComponent, ReasonPopupDialogInline } from './comp-off-list/comp-off-list.component';

@NgModule({
  declarations: [
    AssignCompOffComponent,
    AssignCompOffListComponent,
    CompOffFormComponent,
    AssignCompActionComponent,
    CompOffDialogComponent,
    CompOffListComponent,
    ReasonPopupDialogInline 
  ],
  imports: [
    CommonModule,
    AssignCompOffRoutingModule,
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
    SearchFilterComponent
  ],
})
export class AssignCompOffModule {}
