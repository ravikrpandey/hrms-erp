import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SalesService } from '../../../service/sales.service';

@Component({
  selector: 'app-e-way-dialog',
  templateUrl: './e-way-dialog.component.html',
  styleUrls: ['./e-way-dialog.component.scss']
})
export class EWayDialogComponent {
  cellData: any;
  getData: any = [];
  vieweWayData: any;
  remarkshow: any;
  entity_id: any;
  financial_year_id: any;
  constructor(
    public dialog: MatDialogRef<EWayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sales: SalesService,
  ) {
    this.cellData = this.data.cellData;
  }

  ngOnInit(): void {
    this.entity_id=localStorage.getItem("selectedEntityId")
    this.financial_year_id=localStorage.getItem("financial_id")
    this.getAllEwayDataById();
  }

  getAllEwayDataById() {
    
    this._sales.getAllEwayDataById(this.entity_id,this.financial_year_id,this.cellData?.invoice_id,this.cellData?.id).subscribe(
      (res: any) => {
        this.vieweWayData = res.data;
      },
      (err: any) => {
        if (err.status == 400) {
        }
      }
    );
  }
  formatDate(transportDate: string): string {
    if (!transportDate) return "N/A";
    return transportDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }
}
