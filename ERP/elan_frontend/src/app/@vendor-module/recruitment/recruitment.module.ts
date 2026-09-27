import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { RecruitmentComponent } from './recruitment.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  declarations: [
    RecruitmentComponent
  ],
  imports: [
    CommonModule,
    RecruitmentRoutingModule,
    ShairedModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class RecruitmentModule { }
