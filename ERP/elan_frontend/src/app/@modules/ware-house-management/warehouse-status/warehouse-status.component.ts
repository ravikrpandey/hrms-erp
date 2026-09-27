import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { warehouseListService } from 'src/app/@shared/services/warehouse/warehouse-list.service';

@Component({
  selector: 'app-warehouse-status',
  templateUrl: './warehouse-status.component.html',
  styleUrls: ['./warehouse-status.component.scss']
})
export class WarehouseStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private toster: ToastrService,
    private $warehouseList: warehouseListService,
  ) {
  }

  ngOnInit(): void {
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;

  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // Form update start
  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";

      let body = {
        status: status,
      }
      this.$warehouseList.updateWarehouseStatus(this.cellValue, body).subscribe((response: any) => {
        if (response) {
          this.toster.success('Warehouse Status updated..');
        }
      }, (err:any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end

}







