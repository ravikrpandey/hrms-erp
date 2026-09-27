import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseDashboardRoutingModule } from './purchase-dashboard-routing.module';
import { PurchaseDashboardComponent } from './purchase-dashboard.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CategorySpendChartComponent } from './category-spend-chart/category-spend-chart.component';
import { CategoryTreeMapChartComponent } from './category-tree-map-chart/category-tree-map-chart.component';
import { DepartmentSpendChartComponent } from './department-spend-chart/department-spend-chart.component';
import { RegionSpendChartComponent } from './region-spend-chart/region-spend-chart.component';
import { SpendTrendChartComponent } from './spend-trend-chart/spend-trend-chart.component';
import { SupplierSpendChartComponent } from './supplier-spend-chart/supplier-spend-chart.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PurchaseDashboardComponent,
    CategorySpendChartComponent,
    CategoryTreeMapChartComponent,
    DepartmentSpendChartComponent,
    RegionSpendChartComponent,
    SpendTrendChartComponent,
    SupplierSpendChartComponent
  ],
  imports: [
    CommonModule,
    PurchaseDashboardRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class PurchaseDashboardModule { }
