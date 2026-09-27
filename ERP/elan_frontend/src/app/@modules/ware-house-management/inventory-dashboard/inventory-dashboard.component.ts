import { Component } from "@angular/core";

import { Chart } from "chart.js";
import { InventoryManagementService } from "../inventory-management.service";

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent {
  public chart1: Chart<any>;
  public chart2: Chart<any>;
  warehouseList: any;
  entity_id :any;
  warehouseLabel: any;
  constructor(private inventoryService: InventoryManagementService){

  }
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getWarehouseData();
  }

  createChart1() {
    const warehouseNames = this.warehouseList.map((data: any) => data?.name);


    const usedCapacityValues = this.getWarehouseValues.map((data: any) => data?.usedCapacity);

    this.chart1 = new Chart("canvas1", {
      type: "bar",
      data: {
        labels: warehouseNames,
        datasets: [
          {
            label: "Capacity",
            data: this.getWarehouseValues,
            backgroundColor: '#42A5F5',
            hoverBackgroundColor: '#64B5F6',
            barThickness: 20,

          },
          {
            label: "Used Capacity",
            data: this.userCapacity,
            backgroundColor: '#FF7043',
            hoverBackgroundColor: '#FF8A65',
            barThickness: 20,

          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }
  createChart2(){
    const warehouseNames = this.warehouseList.map((data: any) => data?.name);
    const usedCapacities = this.warehouseList.map((data: any) => data?.used_capacity);
    this.chart2 = new Chart("canvas2", {
      type: "bar",
      data: {
        labels: warehouseNames,
        datasets: [
          {
            label: "# warehouse",
            data:usedCapacities,
            backgroundColor: '#66BB6A',
            hoverBackgroundColor: '#81C784',
            barThickness: 40,
            barPercentage: 0.2,
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }
getWarehouseValues:any=[];
userCapacity:any=[];
  getWarehouseData(){
    this.inventoryService.getWarehouseDashoard(this.entity_id).subscribe((res:any)=>{
      this.warehouseList = res.data || [];
      this.getWarehouseValues= this.warehouseList.map((res:any)=>{
        return res.capacity;
      })
      this.userCapacity= this.warehouseList.map((res:any)=>{
        return res.used_capacity;
      })

      this.createChart1();
      this.createChart2();
    })
  }
}

