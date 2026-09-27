import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-sales-return-action',
  templateUrl: './sales-return-action.component.html',
  styleUrls: ['./sales-return-action.component.scss']
})
export class SalesReturnActionComponent {
assignAction: any;
  entity_id: any;

  tempDoId: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,
    private crmSale: CrmService,
    private _commonService: CommonService,
    private _sales: SalesService
  ) {}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
  }

  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
view(e:any){

  e.stopPropagation();
    
      this.router.navigate(['master/sales/return/view-sales-return'], {
        queryParams: {         
          id:this.cellValue.id
        },
      });
  // this._sales.getSalesReturn('',this.entity_id,this.cellValue.id).subscribe({
  //   next:(res)=> {
  //     console.log('ppppppppppppppppp',res);
  //   },error(err) {
  //     console.log('ssssssssssssssssss',err)
  //   },
  // })
}
}
