import { Component } from '@angular/core';
import { InventoryManagementService } from '../../ware-house-management/inventory-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent {

  totalItems: number = 0;
  totalStock: number = 0;
  availableQty: number = 0;
  holdQty: number = 0;
  deliveredQty: number = 0;
  scrapQty: number = 0;
  warehouseList: any[] = [];
  selectedWarehouseId: number | null;
  topSelling: any = [];
  lowStock: any = [];
  entity_id: number | null;
  financial_year_id: number | null;

  constructor(private inventoryService: InventoryManagementService,
    private accessData: AccessControlService
  ) { }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.loadDashboardData(null);
  }

  loadDashboardData(selectedWarehouseId: number | null) {
    this.inventoryService.getInventoryDashboardData(this.entity_id,selectedWarehouseId).subscribe((res: any) => {
      let data = res?.data;
      this.warehouseList = data.WarehouseList;
      this.selectedWarehouseId = Number(data.selectedWarehouseId);
      let stock = data.stockData;
      this.totalItems = stock.totalItems;
      this.totalStock = stock.totalStock;
      this.availableQty = stock.availableQty;
      this.holdQty = stock.holdQty;
      this.deliveredQty = stock.deliveredQty;
      this.scrapQty = stock.scrapQty;
      this.topSelling = data.sellingData;
      this.lowStock = data.lowStockData;
    });
  }

}