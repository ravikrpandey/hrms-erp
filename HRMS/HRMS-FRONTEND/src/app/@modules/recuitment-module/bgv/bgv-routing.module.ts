import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BgvListComponent } from './bgv-list/bgv-list.component';
import { ReadyForBgvComponent } from './ready-for-bgv/ready-for-bgv.component';
import { BgvSendOnMailComponent } from './bgv-send-on-mail/bgv-send-on-mail.component';
import { ViewCompanyRemarksComponent } from './view-company-remarks/view-company-remarks.component';

const routes: Routes = [
  { path: '', component: BgvListComponent },
  { path: 'ready-for-bgv', component: ReadyForBgvComponent },
  { path: 'bgv-send-on-mail', component: BgvSendOnMailComponent },
  { path: 'view-company-remarks', component: ViewCompanyRemarksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BgvRoutingModule { }
