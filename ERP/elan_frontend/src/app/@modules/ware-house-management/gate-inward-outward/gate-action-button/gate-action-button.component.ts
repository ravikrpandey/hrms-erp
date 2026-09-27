import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddDriverComponent } from '../add-driver/add-driver.component';

@Component({
  selector: 'app-gate-action-button',
  templateUrl: './gate-action-button.component.html',
  styleUrls: ['./gate-action-button.component.scss'],
})
export class GateActionButtonComponent implements ICellRendererAngularComp {
  params: any;
  planningId: string = '';
  showInward: boolean = false;
  showOutward: boolean = false;
  mainId: any;
  activeLabel:any
  constructor(
    private toaster: ToastrService,
    private apiUrl: warehouseListService,
    private dialog: MatDialog,
    private route: Router,
    private activeRoute: ActivatedRoute
    
  ) {
    this.activeLabel = this.activeRoute.snapshot.data['label'];
  }

  agInit(params: any): void {
    this.params = params;
    const data = params.data;
    this.planningId = data.vehicle_planing_id;
    this.mainId = data.id;

    // Decide which button to show
    if (
      data.gate_inward_status === 'Pending' &&
      data.gate_by_pass === 'NO'
    ) {
      this.showInward = true;
    } else if (
      data.gate_inward_status === 'Approved' &&
      data.gate_outward_status === 'Pending' &&
      data.LR_status === 'Approved' &&
      data.gate_by_pass === 'NO'
    ) {
      this.showOutward = true;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

  ViewperformAction() {
    if(this.activeLabel==='outward'){
      this.route.navigate(['master/warehouse-management/pick-list/invoice-view'], {
        queryParams: {
          action_type: 'view',
          id: this.planningId,
        },
      });
    }else{
      this.route.navigate(['master/warehouse-management/vehicle-planning/add'], {
        queryParams: {
          mode: 'view',
          vpId: this.planningId,
        },
      });
    }
  }

  performAction(type: 'inward' | 'outward') {
    let obj = { id: this.mainId, type: type, vehicle_planing_id: this.planningId };
    this.apiUrl.updateGateInwardOutward(obj).subscribe(
      (res: any) => {
        this.toaster.success(res.message);
        this.reloadCurrentRoute();
      },
      (error) => {
        this.toaster.error(error.error.message);
      }
    );
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddDriverComponent, {
      width: '40%',
      data: this.params.data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.status) {
        this.toaster.success(result.message);
        this.dialog.closeAll();
        this.reloadCurrentRoute();
      }
      // window.location.reload();
    });
  }
   downloadGateOutWordPdf(e: any) {
    e.stopPropagation();
    const id =this.planningId;
    const type=this.activeLabel;
    
    this.apiUrl.downloadGateOutWard(id,type).subscribe({
      next: (blob: Blob) => {

        console.log('Blob Size:', blob.size);
        console.log('Blob Type:', blob.type);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Gate${type}_${id}.pdf`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
