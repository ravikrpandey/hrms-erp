import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { InventoryManagementService } from '../../inventory-management.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AgGridTooltipComponent } from 'src/app/@shared/components/ag-grid-tooltip/ag-grid-tooltip.component';

@Component({
  selector: 'app-rfq-dialog',
  templateUrl: './rfq-dialog.component.html',
  styleUrls: ['./rfq-dialog.component.scss']
})
export class RfqDialogComponent implements OnInit {
  isRollingBack = false;
  isAnyAdminAccepted: boolean = false;

@ViewChild('gridContainer')
gridContainer!: ElementRef;
showTooltip = false;
tooltipX = 0;
tooltipY = 0;
tooltipData: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<RfqDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transport_service: TransportManagementService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {


    console.log(this.data);
    this.getsTransAdminApprovel(this.data.id);
  }


  getsTransAdminApprovel(vpId: any) {
    this.transport_service.getsTransAdminApprovel(vpId).subscribe({
      next: (res: any) => {
        // console.log(res);

        // let levelCounter = 1;

        this.rowData = res.data
          // .sort((a: any, b: any) => Number(a.amount) - Number(b.amount))
          // .map((item: any) => ({
          //   ...item,
          //   level:
          //     item.transporter_status === 'ACCEPTED'
          //       ? `L${levelCounter++}`
          //       : null
          // }));
        this.isAnyAdminAccepted = this.rowData.some((x: any) => x.admin_status === 'ACCEPTED');
        // console.log(this.rowData);
      },
      error(err) {
        console.log(err);
      },
    });
  }
  rowClass: string = 'rowClass';
  rowData: any[] = [];
  public defaultColDef = {
    sortable: true,
    resizable: true,
   
  };
  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      width: 20,
     
    },
    // {
    //   headerName: 'Level',
    //   field: 'level',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   cellRenderer: this.levelTextDecoration.bind(this),
    // },
    {
      headerName: 'Level',
      field: 'level',
      flex: 1,
      cellRenderer: this.levelTextDecoration.bind(this),
      onCellMouseOver: (params: any) => {
        this.openTooltip(params);
      },
      onCellMouseOut: () => {
        this.closeTooltip();
      }
    },
    {
      headerName: 'Amount',
      field: 'amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    
    },
    {
      headerName: 'Remark',
      field: 'remark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
     
    },
    {
      headerName: 'Transporter Status',
      field: 'transporter_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    
    },
    {
      headerName: 'Transporter Status Date',
      field: 'transporter_status_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
     
    },
    {
      headerName: 'Transporter Name',
      // field: 'tm_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueGetter: (params: any) => {
        return params?.data?.transporterDetails?.tm_name || '';
      },
      
    },
    {
      headerName: 'Admin Status',
      field: 'admin_status',
      flex: 1,
      cellClass: 'grid-cell-centered',

      editable: (params: any) => !this.isAnyAdminAccepted && params?.data?.transporter_status === 'ACCEPTED' && params?.data?.admin_status !== 'CANCELED' && params?.data?.admin_status !== 'ACCEPTED',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Pending', 'ACCEPTED', 'CANCELED']
      },

      cellRenderer: (params: any) => {
        const status = params.value;
        const transporterAccepted = params.data.transporter_status === 'ACCEPTED';
        const adminCancelled = params.data.admin_status === 'CANCELED' || params.data.admin_status === 'ACCEPTED';
        const colors: any = {
          Pending: '#f0ad4e',
          Approved: '#28a745',
          Rejected: '#dc3545'
        };
        const isEditable = !this.isAnyAdminAccepted && transporterAccepted && !adminCancelled;

        return `
    <span style="
      padding:4px 10px;
      border-radius:12px;
      font-weight:600;
      color:white;
      background:${colors[status] || '#6c757d'};
      opacity:${isEditable ? '1' : '0.6'};
      cursor: ${isEditable ? 'pointer' : 'not-allowed'};
    ">
      ${!isEditable ? '🔒 ' : ''}${status}
    </span>
  `;
      },

      onCellValueChanged: (params: any) => {
        if (this.isRollingBack) {
          this.isRollingBack = false;
          return;
        }
        this.confirmAdminStatusChange(params);
      },
   
    },


    {
      headerName: 'Admin Date',
      field: 'admin_status_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    
    },

  ];

  confirmAdminStatusChange(params: any) {
    Swal.fire({
      title: 'Confirm Status Change',
      text: `Are you sure you want to change status to "${params.newValue}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'CANCELED'
    }).then((result: any) => {

      if (result.isConfirmed) {
        this.updateAdminStatus(params);
      } else {
        this.isRollingBack = true;
        params.node.setDataValue('admin_status', params.oldValue);
      }

    });
  }

  openTooltip(params: any) {
    this.tooltipData = params.data.transporters || [];

    const event = params.event;
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY + 10;

    this.showTooltip = true;
  }

  closeTooltip() {
    this.showTooltip = false;
  }

  updateAdminStatus(params: any) {
    const payload = {
      id: params.data.id,
      admin_status: params.newValue,
      admin_status_date: new Date().toISOString().split('T')[0]
    };

    this.transport_service.updateTransporterAdminStatus(payload).subscribe({
      next: () => {
        this.toast.success('Admin status updated successfully');
        this.getsTransAdminApprovel(params.data.vehicle_planing_id)
      },
      error: () => {
        this.toast.error('Failed to update admin status');
      }
    });
  }

  closeModal() {

    this.dialogRef.close(true);
  }
 
onCellClicked(params: any) {

  if (params.colDef.field !== 'level') {
    this.showTooltip = false;
    return;
  }

  this.tooltipData = params.data.transporters || [];

  // Clicked cell
  const cell = params.event.target.closest('.ag-cell') as HTMLElement;

  if (!cell) {
    return;
  }

  const cellRect = cell.getBoundingClientRect();
  const gridRect =this.gridContainer.nativeElement.getBoundingClientRect();

  this.tooltipX =cellRect.left - gridRect.left + cell.offsetWidth ;

  this.tooltipY =cellRect.top - gridRect.top;

  this.showTooltip = true;
}
//  levelTextDecoration(params: any) {
//     const cellValue = params.value;
//     const clickableContent = document.createElement('div');
//     clickableContent.style.cursor = 'pointer';
//     clickableContent.style.textDecoration = 'underline';
//     clickableContent.innerText = cellValue;
   
//     return clickableContent;
//   }
  levelTextDecoration(params: any) {
    const span = document.createElement('span');
    span.innerHTML = `${params.value} <i class="fa fa-info-circle"></i>`;
    span.className = 'level-badge';

    span.onmouseenter = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();

      this.tooltipData = params.data.transporters || [];
      this.tooltipX = rect.left;
      this.tooltipY = rect.bottom + 5;
      this.showTooltip = true;
    };

    span.onmouseleave = () => {
      this.showTooltip = false;
    };

    return span;
  }
}
