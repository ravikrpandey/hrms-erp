import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatutoryRoutingModule } from './statutory-routing.module';
import { StatutoryComponent } from './statutory/statutory.component';

@NgModule({
  declarations: [StatutoryComponent],
  imports: [CommonModule, StatutoryRoutingModule],
})
export class StatutoryModule {}
