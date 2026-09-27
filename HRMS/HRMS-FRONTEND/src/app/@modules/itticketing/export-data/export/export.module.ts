import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportRoutingModule } from './export-routing.module';
import { ExportComponent } from './export.component';
import { DownloadFunctioningComponent } from './download-functioning/download-functioning.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HttpClientModule } from '@angular/common/http';
import { NgxCopyToClipboardModule } from 'ngx-copy-to-clipboard';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ExportComponent,
    DownloadFunctioningComponent
  ],
  imports: [
    CommonModule,
    ExportRoutingModule,
    NgxCaptchaModule,
    HttpClientModule,
    NgxCopyToClipboardModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class ExportModule { }
