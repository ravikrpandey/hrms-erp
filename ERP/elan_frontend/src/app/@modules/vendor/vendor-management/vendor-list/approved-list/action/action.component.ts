import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionApprovedComponent {
  cellValue: any;
  constructor(private route: Router,
    private vendorService: VendorManagementService) {}
  ngOnInit(): void {
    
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.vendor_management_id;
  }

  edit(e:any){
    e.stopPropagation();
    this.route.navigate(['master/vendor/vendor-management/vendor-list/create-vendor/basic-details'],
      { queryParams: { id: this.cellValue}})
      this.vendorService.setVendorId(Number(this.cellValue))
  }
}
