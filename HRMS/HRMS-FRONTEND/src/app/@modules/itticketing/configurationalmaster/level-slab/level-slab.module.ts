import { LevelSlabComponent } from './level-slab.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ActionComponent } from './action/action.component';
import { AgGridModule } from 'ag-grid-angular';
import { LevelSlabRoutingModule } from './level-slab-routing.module';
import { LevelDialogComponent } from './level-dialog/level-dialog.component';
import { LevelSlabStatusComponent } from './action/level-slab-status/level-slab-status.component';



@NgModule({
  declarations: [
    LevelSlabComponent,
    ActionComponent,
    LevelDialogComponent,
    LevelSlabStatusComponent
  ],
  imports: [
    CommonModule,
    LevelSlabRoutingModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    AgGridModule
  ]
})
export class LevelSlabModule { }
