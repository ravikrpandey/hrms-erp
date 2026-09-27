import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingNameRoutingModule } from './training-name-routing.module';
import { TrainingNameComponent } from './training-name.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActionComponent } from './action/action.component';
import { AgGridModule } from 'ag-grid-angular';
import { TrainingDialogComponent } from './training-dialog/training-dialog.component';






@NgModule({
  declarations: [
    TrainingNameComponent,
    ActionComponent,
    TrainingDialogComponent,
  ],
  imports: [  
    TrainingNameRoutingModule,
    CommonModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    AgGridModule
  ]
})
export class TrainingNameModule { }
