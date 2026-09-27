import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  cellValue: any;
  idGet: any;
  assignAction: any;
  constructor(private route: Router,private vendorService: VendorManagementService,private _rbackService: RbacMasterService,) {}
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.idGet=params?.data?.id
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.vendor_management_id;
  }

  edit(e:any){
    e.stopPropagation();
    this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'],
      { queryParams: { id: this.idGet,type:'Edit'}})
      this.vendorService.setVendorId(Number(this.idGet))
  }

  view(e:any){
    e.stopPropagation();
    this.route.navigate(['master/vendor/vendor-list/create-vendor/basic-details'],
      { queryParams: { id: this.idGet,type:'View'}})
      this.vendorService.setVendorId(Number(this.idGet))
  }


}
