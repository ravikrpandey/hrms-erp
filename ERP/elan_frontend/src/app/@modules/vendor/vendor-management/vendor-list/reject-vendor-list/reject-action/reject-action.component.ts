import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-reject-action',
  templateUrl: './reject-action.component.html',
  styleUrls: ['./reject-action.component.scss']
})
export class RejectActionComponent {
  cellValue: any;
  constructor(private route: Router,private vendorService: VendorManagementService) {}
  ngOnInit(): void {
    
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.vendor_management_id;
  }
}
