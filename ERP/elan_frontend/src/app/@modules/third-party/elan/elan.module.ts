import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElanRoutingModule } from './elan-routing.module';
import { ElanComponent } from './elan.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ElanComponent],
  imports: [CommonModule, ElanRoutingModule, RouterModule],
})
export class ElanModule {}
