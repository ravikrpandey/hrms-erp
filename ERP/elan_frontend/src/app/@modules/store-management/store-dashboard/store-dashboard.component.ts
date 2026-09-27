import { Component } from "@angular/core";

import { Chart } from "chart.js";
import { StoreManagementService } from "../store-management.service";

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  styleUrls: ['./store-dashboard.component.scss']
})
export class StoreDashboardComponent {
  public chart1: Chart<any>;
  public chart2: Chart<any>;
  itemWiselist: any;
  entity_id :any;
  warehouseLabel: any;
  itemQty:any =[];
  employee_id: any;
  loginUserDetails: any;
  role:any;
  assetCount: any = [];
  constructor(private stockService: StoreManagementService){
   
  }
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.employee_id = localStorage.getItem("EmpMainId")
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.getStoreData();
  }

  createChart1(){
    const warehouseNames = this.itemWiselist.map((data: any) => data.store_name);
    this.chart1 = new Chart("canvas1", {
      type: "bar",
      data: {
        labels: warehouseNames,
        datasets: [
          {
            label: "# Item Quantity",
            data: this.itemQty,
            backgroundColor: '#42A5F5',
            hoverBackgroundColor: '#64B5F6',
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

  createChart2(){
    const warehouseNames = this.itemWiselist.map((data: any) => data.store_name);
    this.chart2 = new Chart("canvas2", {
      type: "bar",
      data: {
        labels: warehouseNames,
        datasets: [
          {
            label: "# Category",
            data: this.assetCount,
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

  getStoreData(){
    this.stockService.getStockDashoard(this.entity_id,this.employee_id,this.role).subscribe(async (res:any)=>{
      this.itemWiselist = res.data || [];  
      await this.itemWiselist.forEach((element:any) => {
        this.itemQty.push(element.itemQty)
        this.assetCount.push(element.asset_count)
      });
      this.createChart1();
      this.createChart2();
    })
  }
}


