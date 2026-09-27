import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesTargetAchievementComponent } from './sales-target-achievement.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesTargetComponent } from './sales-target/sales-target.component';
import { CreateTargetComponent } from './create-target/create-target.component';
import { TargetAchievementComponent } from './target-achievement/target-achievement.component';
import { AchievementDetailsComponent } from './target-achievement/achievement-details/achievement-details.component';

const routes: Routes = [
  {
      path: '',
      component: SalesTargetAchievementComponent,
      children: [
        {
          path: 'dashboard',
          component: DashboardComponent,
        },
        {
          path: 'sales-target',
          component: SalesTargetComponent,
        },
        {
          path: 'create-target',
          component: CreateTargetComponent,
        },
        {
          path: 'achievement-list',
          component: TargetAchievementComponent,
        },
        {
          path: 'achievement-details',
          component: AchievementDetailsComponent,
        }
      ],
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesTargetAchievementRoutingModule { }
