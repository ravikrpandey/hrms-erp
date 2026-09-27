import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action-production',
  templateUrl: './action-production.component.html',
  styleUrls: ['./action-production.component.scss']
})
export class ActionProductionComponent {
  cellValue: any;
  assignAction: any;
  urlData:any


  constructor(private route: Router,public dialog: MatDialog,
  private _production:ProductionService ) {}
  ngOnInit(): void {
    this.urlData=environment.servralUrl;
  }

  ngAfterViewInit(): void {

  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.valueFormatted ? params.valueFormatted : params.data;
  }

scheduleProduction(){
  
  this.route.navigate(['/master/production/add-new-production'],{queryParams:{id:this.cellValue.id,do_id:this.cellValue.doItem_id}});
}

}
