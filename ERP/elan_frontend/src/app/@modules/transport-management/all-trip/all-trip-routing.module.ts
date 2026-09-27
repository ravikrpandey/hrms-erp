import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTripComponent } from './all-trip.component';
import { ApprovedTripComponent } from './approved-trip/approved-trip.component';
import { ScheduleTripComponent } from './schedule-trip/schedule-trip.component';
import { LiveTripComponent } from './live-trip/live-trip.component';
import { ClosedTripComponent } from './closed-trip/closed-trip.component';
import { CreateScheduleTripComponent } from './create-schedule-trip/create-schedule-trip.component';
import { LiveTripInfoComponent } from './live-trip-info/live-trip-info.component';

const routes: Routes = [
  {
    path: '',
    component: AllTripComponent,

    children: [
      {
        path: '', redirectTo: 'approved-trip-list', pathMatch: 'full'
      },
      { path: "approved-trip-list", component: ApprovedTripComponent },
      { path: "schedule-trip-list", component: ScheduleTripComponent },
      { path: "live-trip-list", component: LiveTripComponent },
      { path: "closed-trip-list", component: ClosedTripComponent },
      { path: "live-trip-info", component: LiveTripInfoComponent },
    ],
  },
  { path: "create-schedule-trip", component: CreateScheduleTripComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTripRoutingModule { }
