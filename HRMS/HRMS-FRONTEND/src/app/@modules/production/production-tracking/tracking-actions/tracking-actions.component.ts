import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tracking-actions',
  templateUrl: './tracking-actions.component.html',
  styleUrls: ['./tracking-actions.component.scss']
})
export class TrackingActionsComponent {
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router:Router,
    private toaster:ToastrService,
    private productService:ProductionService,
    private _configurationalMasterService:ConfigurationalmasterService
  ) {
  }
  ngOnInit(): void {
    this.getValueToDisplay
     
  }
  public cellValue: any;
  currentStatus:any
  agInit(params: ICellRendererParams): void {
    
    this.currentStatus=params;
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }
  refresh(params: ICellRendererParams) {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
  }
  

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
 
  editProductionTracking(){
    this.router.navigate(['/master/production/edit-production-tracking'],{ queryParams: { id: this.cellValue}})
  }
  productionMaintenance(){
    this.router.navigate(['/master/production/production-maintenance'],{ queryParams: { id: this.cellValue}})
  }
  
  trackingChart(){
    this.router.navigate(['/master/production/production-tracking-chart'],{ queryParams: { id: this.cellValue}})

  }
}
