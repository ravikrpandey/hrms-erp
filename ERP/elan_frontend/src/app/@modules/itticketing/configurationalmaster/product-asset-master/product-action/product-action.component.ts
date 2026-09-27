import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-action',
  templateUrl: './product-action.component.html',
  styleUrls: ['./product-action.component.scss']
})
export class ProductActionComponent {
  cellValue: any;
  constructor(private route: Router, 
    private toster: ToastrService) {}
  ngOnInit(): void {
    
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.asset_management_id;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/itticket/configurational-master/product-asset-create'],
      { queryParams: { asset_management_id: this.cellValue} })
  }

}
