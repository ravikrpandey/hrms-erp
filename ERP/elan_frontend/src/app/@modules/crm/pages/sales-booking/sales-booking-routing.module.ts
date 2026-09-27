import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesBookingListComponent } from './sales-booking-list/sales-booking-list.component';
import { SalesBookingMainComponent } from './sales-booking-main/sales-booking-main.component';
import { SalesBookingPendingComponent } from './sales-booking-pending/sales-booking-pending.component';
import { SalesBookingApprovedComponent } from './sales-booking-approved/sales-booking-approved.component';
import { SalesBookingRejectComponent } from './sales-booking-reject/sales-booking-reject.component';

const routes: Routes = [
  {
    path: '',
    component: SalesBookingMainComponent,
    children: [
      { path: '', redirectTo: 'all-list', pathMatch: 'full' },
      { path: 'all-list', component: SalesBookingListComponent },
      { path: 'pending-list', component: SalesBookingPendingComponent },
      { path: 'approved-list', component: SalesBookingApprovedComponent },
      { path: 'reject-list', component: SalesBookingRejectComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesBookingRoutingModule {}
