import { Component } from '@angular/core';
import { ChartData } from 'chart.js';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.scss'],

})
export class AssetDashboardComponent {
  lifecyclePieData: any;
  valueDistributionData: any;
  assetsPerLocationData: any;
  assetsPerDepartmentData:any;
  total_assets:any;
  asset_categories:any;
  total_value:any;
  entity_id: any;

  constructor(private asset_service: AssetListService) {
    this.entity_id = localStorage.getItem('selectedEntityId');
  }

  ngOnInit(): void {
    this.asset_service.getDashboardStats(this.entity_id).subscribe((res:any) => {
      const data = res.data;
      this.total_assets =data.totalAssets;
      this.asset_categories = data.byType;
      this.total_value = data.totalValue;
      // Example formatting for lifecycle pie chart
      this.lifecyclePieData = {
        labels: data.lifecycleStatus.map((item: any) => item.status),
        datasets: [{
          data: data.lifecycleStatus.map((item: any) => item.count),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        }]
      };

      // Doughnut chart
      this.valueDistributionData = {
        labels: data.valueDistribution.map((item: any) => item.category),
        datasets: [{
          label: 'Assets',
          data: data.valueDistribution.map((item: any) => item.total),
          backgroundColor: ['#ffcd56', '#4bc0c0', '#9966ff'],
        }]
      };

      // Bar chart
      this.assetsPerLocationData = {
        labels: data.assetsPerLocation.map((item: any) => item.location),
        datasets: [{
          label: 'Assets',
          data: data.assetsPerLocation.map((item: any) => item.asset_count),
          backgroundColor: '#42a5f5'
        }]
      };
      this.assetsPerDepartmentData = {
        labels: data.assetsPerDepartment.map((item: any) => item.department),
        datasets: [{
          label: 'Assets',
          data: data.assetsPerDepartment.map((item: any) => item.asset_count),
          backgroundColor: '#42a5f5'
        }]
      };

    });
  }
}
