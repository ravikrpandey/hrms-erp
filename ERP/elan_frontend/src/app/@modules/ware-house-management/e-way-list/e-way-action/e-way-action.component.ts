import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { IdEncoderService } from 'src/app/@shared/services/id-encoder.service';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-e-way-action',
  templateUrl: './e-way-action.component.html',
  styleUrls: ['./e-way-action.component.scss']
})


export class EWayActionComponent {
  
  employee_complaint_id: any;
  assignAction: any;
  rowData: any;

  constructor(private apiUrl: warehouseListService,private toaster:ToastrService,private route: Router, private idencrypt:IdEncoderService) {
  }

  ngOnInit(): void {
   
  }
  public cellValue: any;


  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


   view(e:any){
    this.route.navigate(['master/warehouse-management/pick-list/invoice-view'],{queryParams:{id:this.cellValue.vehicle_planing_id,action_type:'view',status:'IRN',type:'e-way'}})
   }

  // viewPdf() {
  //   let payload = {
  //     vehicle_planing_id: this.cellValue.vehicle_planing_id
  //   };
  
  //   this.apiUrl.genratePdfinvoice(payload).subscribe(
  //     (res: any) => {
  
  //       const byteArray = new Uint8Array(res.data.data);
  
  //       const blob = new Blob([byteArray], { type: 'application/pdf' });
  
  //       const url = window.URL.createObjectURL(blob);
  
  //       const win = window.open(url, '_blank');
  
  //       if (!win) {
  //         this.toaster.error('Popup blocked');
  //       }
  //     },
  //     () => this.toaster.error('Failed to open PDF')
  //   );
  // }

  downloadPdf() {
    let payload = {
      vehicle_planing_id: this.cellValue.vehicle_planing_id
    };
  
    this.apiUrl.genratePdfEwayinvoice(payload).subscribe(
      (res: any) => {
  
        const byteArray = new Uint8Array(res.data.data);
  
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = 'E-Invoice.pdf';
        a.click();
  
        window.URL.revokeObjectURL(url);
      },
      () => this.toaster.error('Failed to download PDF')
    );
  }

}
