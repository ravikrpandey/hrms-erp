import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';

@Component({
  selector: 'app-quality-control-action',
  templateUrl: './quality-control-action.component.html',
  styleUrls: ['./quality-control-action.component.scss']
})
export class QualityControlActionComponent {
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
  
  qualityById(){
    this.router.navigate(['/master/quality-management/plant-sample-list'],{queryParams:{plant_id:this.cellValue}})
  }
  qualityChart(){
    // this.router.navigate(['/master/quality-management/view-quality-chart'],{queryParams:{qualityChart:this.cellValue}})
  }
}
