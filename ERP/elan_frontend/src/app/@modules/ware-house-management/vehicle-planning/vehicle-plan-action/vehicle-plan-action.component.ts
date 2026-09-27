import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-vehicle-plan-action',
  templateUrl: './vehicle-plan-action.component.html',
  styleUrls: ['./vehicle-plan-action.component.scss'],
})
export class VehiclePlanActionComponent {
  @Input() showEdit = false;
  @Input() showDetails = false;
  @Input() showView = false;
  cellValue: any;

  constructor(private router: Router, public dialog: MatDialog, private toast: ToastrService, private transport_service: TransportManagementService,) { }

  ngOnInit(): void { }
  params!: ICellRendererParams;
  agInit(params: ICellRendererParams): void {
    this.params = params; // ✅ VERY IMPORTANT

    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  editSubtype(event: any) {
    const combinedValue = this.cellValue.item_id;
    event.stopPropagation();
    this.router.navigate(
      ['/master/warehouse-management/vehicle-planning/add'],
      {
        queryParams: {
          mode: 'edit',
          vpId: this.cellValue.id,
        },
      }
    );
  }

  veiwSubtype(event: any) {
    const combinedValue = this.cellValue.id;
    event.stopPropagation();
    this.router.navigate(
      ['/master/warehouse-management/vehicle-planning/add'],
      {
        queryParams: {
          mode: 'view',
          vpId: this.cellValue.id,
        },
      }
    );
  }

  openDialog(e: any) {
    e.stopPropagation();

    Swal.fire({
      title: 'Confirm vehicle planning approvel',
      text: `Are you sure you want to approved vehicle planning"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {

      if (result.isConfirmed) {
        const payload = {
          id: this.cellValue.id,
          status: "Approved"
        }
        this.transport_service.approvedVehiclePlanning(payload).subscribe({
          next: (res: any) => {
            console.log(res);
            this.toast.success(res.message);
            this.params.data.status = 'Approved';
            this.params.api.applyTransaction({
              update: [this.params.data]
            });
            // this.router.navigate(['/master/warehouse-management/vehicle-planning'] );
          }, error(err) {
            console.log(err);
          },
        })
      } else {

      }

    });
  }

}
