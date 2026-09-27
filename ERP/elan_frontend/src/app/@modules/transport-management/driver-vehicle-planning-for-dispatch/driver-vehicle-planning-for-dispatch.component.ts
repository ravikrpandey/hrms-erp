import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryRootPodComponent } from './delivery-root-pod/delivery-root-pod.component';

@Component({
  selector: 'app-driver-vehicle-planning-for-dispatch',
  templateUrl: './driver-vehicle-planning-for-dispatch.component.html',
  styleUrls: ['./driver-vehicle-planning-for-dispatch.component.scss']
})
export class DriverVehiclePlanningForDispatchComponent {

  private gridApi!: GridApi<any>;
  entity_id: any;
  financial_year_id: any;
  public rowData: any = [];

  tabConfig = [
    {
      id: 1,
      name: 'Assignment & Planning',
      pageTitle: 'Assign Driver & Vehicle to Orders',
      queryStatus: 'PENDING'
    },
    {
      id: 2,
      name: 'Planned – Ready for Pickup',
      pageTitle: 'Planned Trips Ready for Pickup at Warehouse',
      queryStatus: 'READY_FOR_PICKUP'
    },
    {
      id: 3,
      name: 'At Warehouse',
      pageTitle: 'Vehicles Arrived at Warehouse (Ready for Dispatch)',
      queryStatus: 'AT_WAREHOUSE'
    },
    {
      id: 4,
      name: 'Dispatched',
      pageTitle: 'Vehicles Dispatched from Warehouse',
      queryStatus: 'DISPATCHED'
    },
    {
      id: 5,
      name: 'Out for Delivery',
      pageTitle: 'Vehicles Out for Delivery',
      queryStatus: 'OUT_FOR_DELIVERY'
    },
    {
      id: 6,
      name: 'Delivered / POD',
      pageTitle: 'Delivered Shipments & POD Upload',
      queryStatus: 'DELIVERED'
    }
  ];

  selectedTab: number = 1;
  pageTitle: string = this.tabConfig[0].pageTitle; // default
  
  constructor(
    private transport_service : TransportManagementService,
    private accessData: AccessControlService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.filterGridData(this.tabConfig[0]);
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: 'grid-cell-centered',
      flex: .4
    },
    {
      headerName: 'Vehicle Planning Code',
      field: 'planning_code',
      cellClass: 'grid-cell-centered',
      flex: .9
    },
    {
      headerName: 'Route Type',
      field: 'vehicle_root_status',
      cellClass: 'grid-cell-centered',
      flex: .6
    },
    {
      headerName: 'Vehicle Type',
      field: 'vehicle_type_name',
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Transporter Name',
      field: 'tm_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      tooltipField: 'tm_name',
    },
    // {
    //   headerName: 'Pickup Points',
    //   field: 'pickup_point',
    //   cellClass: 'grid-cell-centered',
    //   flex: .6
    // },
    {
      headerName: 'Pickup Date',
      field: 'pickup_date',
      cellClass: 'grid-cell-centered',
      flex: .6,
      valueFormatter: (params: any) =>
        params.value ? moment(params.value).format('DD-MM-YYYY') : ''
    },
    {
      headerName: 'Delivery Points',
      field: 'delivery_point',
      cellClass: 'grid-cell-centered',
      flex: .6,
      cellRenderer: (params: any) => {
        return `
          <span>${params.value || 0}</span>
          <i class="material-icons"
            style="cursor:pointer;color:#1976d2"
            title="Delivery Route Details">
            info
          </i>
        `;
      },
      onCellClicked: (params: any) => {
        this.openDeliveryRootPopup(params.data,'View');
        return;
      }
    },
    {
      headerName: 'Delivery & POD Status',
      field: 'trip_status',
      flex: .9,
      cellRenderer: (params: any) => {
        const showOutForDelivery = params.value === 'DISPATCHED';
        const showDelivery = params.value === 'OUT_FOR_DELIVERY';
        const showPOD = params.value === 'DELIVERED';
        //const isPODVerified = params.data?.pod_status == 'COMPLETED';
        const isPODVerified = params.data?.pod_allstatus == 'Verify'; // Verify/Unverify
        return `<div style="display:flex;align-items:center;gap:6px">
          <span class="trip-status-chip" data-status="true" title="Manage driver/vehicle">
          ${params.value}
          </span>
          ${showOutForDelivery
          ? `<i class="material-icons delivery-icon"
              title="Go to Out For Delivery"
              data-delivery="true"
              style="cursor:pointer;font-size:18px;color:#1976d2">
              local_shipping
            </i>`
          : ''
          }
          ${showDelivery
          ? `<i class="material-icons delivery-icon"
              title="Go to Delivery"
              data-delivery="true"
              style="cursor:pointer;font-size:18px;color:#2e7d32">
              check_circle
            </i>`
          : ''
          }
          ${showPOD
            ? `<i class="material-icons pod-icon"
                title="Upload/View POD"
                data-pod="true"
                style="cursor:pointer;font-size:18px;color:#2e7d32">
                description
              </i>`
            : ''
          } 
          <i class="material-icons verify-icon"
              title="${isPODVerified ? 'POD Verified' : 'Verification Pending'}"
              style="font-size:18px;color:${isPODVerified ? '#4caf50' : '#f44336'}">
              ${isPODVerified ? 'verified' : 'error'}
            </i>
          </div>`;
      },
      onCellClicked: (params: any) => {
        
        if (params.event.target.dataset.delivery) {
          this.goToDeliveryTab(params.data);
          return;
        }

        if (params.event.target.dataset.pod) {
          params.event.stopPropagation();
          this.goToPOD(params.data);
          return;
        }

        if (params.event.target.dataset.status) {
          params.event.stopPropagation();
          this.OnClick(params.data);
          return;
        }
      }
    }
  ];

  openDeliveryRootPopup(row: any, mode: any) {
    const payload = {
      ...row,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id
    };

    const dialogRef = this.dialog.open(DeliveryRootPodComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      panelClass: 'full-screen-dialog',
      data: {
        data: payload,
        mode: mode
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res?.success) {
        this.filterGridData(this.tabConfig[5]);
      }
    });
  }

  OnClick(row: any) {

    let selectedDriver = row.driver_id || '';
    let selectedVehicle = row.vehicle_id || '';

    const status = row.trip_status;

    // 🔹 Status flags
    const isPending = status === 'PENDING';
    const isReady = status === 'READY_FOR_PICKUP';
    const isReadOnly = status !== 'PENDING' && status !== 'READY_FOR_PICKUP';

    forkJoin({
      drivers: this.transport_service.getDriverListForDispatch(
        this.entity_id,
        selectedDriver
      ),
      vehicles: this.transport_service.getVehicleListForDispatch(
        this.entity_id,
        row.vehicle_type_id,
        selectedVehicle
      )
    }).subscribe({
      next: ({ drivers, vehicles }) => {

        const driverOptions = drivers.data
          .map((d: any) =>
            `<option value="${d.driver_id}" ${d.driver_id == selectedDriver ? 'selected' : ''}>
              ${d.dname}
            </option>`
          ).join('');

        const vehicleOptions = vehicles.data
          .map((v: any) =>
            `<option value="${v.id}" ${v.id == selectedVehicle ? 'selected' : ''}>
              ${v.vehicle_number}
            </option>`
          ).join('');

        Swal.fire({
          title: 'Assign Driver & Vehicle',

          html: `
            <select id="driver" class="swal2-input" ${isReadOnly ? 'disabled' : ''}>
              <option value="">Select Driver</option>
              ${driverOptions}
            </select>

            <select id="vehicle" class="swal2-input" ${isReadOnly ? 'disabled' : ''}>
              <option value="">Select Vehicle</option>
              ${vehicleOptions}
            </select>
          `,

          showCancelButton: true,
          cancelButtonText: 'Close',

          // 🔹 Buttons visibility
          showConfirmButton: isPending,
          confirmButtonText: 'Move to Ready for Pickup',

          showDenyButton: !isReadOnly,
          denyButtonText: 'Save',

          allowOutsideClick: false,

          // 🔹 READY FOR PICKUP (Confirm)
          preConfirm: isPending ? () => {
            const driver_id = (document.getElementById('driver') as HTMLSelectElement).value;
            const vehicle_id = (document.getElementById('vehicle') as HTMLSelectElement).value;

            if (!driver_id || !vehicle_id) {
              Swal.showValidationMessage('Driver & Vehicle both are required');
              return false;
            }
            return { driver_id, vehicle_id };
          } : undefined,

          // 🔹 SAVE (Deny)
          preDeny: !isReadOnly ? () => {
            const driver_id = (document.getElementById('driver') as HTMLSelectElement).value;
            const vehicle_id = (document.getElementById('vehicle') as HTMLSelectElement).value;

            if (!driver_id || !vehicle_id) {
              Swal.showValidationMessage('Driver & Vehicle both are required');
              return false;
            }
            return { driver_id, vehicle_id };
          } : undefined

        }).then((result) => {

          // 🔹 Read only – nothing to do
          if (!result.value || isReadOnly) return;

          const payload: any = {
            table_id: row.id,
            driver_id: result.value.driver_id,
            vehicle_id: result.value.vehicle_id
          };

          let callTab = this.tabConfig[0];

          // 🔹 Move to Ready for Pickup
          if (result.isConfirmed && isPending) {
            payload.trip_status = 'READY_FOR_PICKUP';
            callTab = this.tabConfig[1];
          }

          if(isReady){
            callTab = this.tabConfig[1];
          }

          this.transport_service.assignDriverVehicleForDispatch(payload).subscribe({
            next: (res: any) => {
              Swal.close();
              this.toastr.success(res.message || 'Saved successfully');
              this.filterGridData(callTab);
            },
            error: (err) => {
              Swal.close();
              this.toastr.error(err?.error?.message || 'Failed to save data');
            }
          });
        });
      },

      error: () => {
        Swal.fire('Error', 'Failed to load drivers / vehicles', 'error');
      }
    });
  }

  goToDeliveryTab(row: any) {
    const isDispatched = row.trip_status === 'DISPATCHED';
    Swal.fire({
      title: isDispatched ? 'Confirm Out for Delivery' : 'Confirm Delivery',
      text: isDispatched
      ? 'Mark this shipment as Out for Delivery?'
      : 'Has this shipment been delivered?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isDispatched ? 'Out for Delivery' : 'Delivered',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,

      preConfirm: () => {
        Swal.showLoading();
          
          const payload: any = {
            table_id: row.id,
            driver_id: row.driver_id,
            vehicle_id: row.vehicle_id,
            trip_status: row.trip_status
          };

          return this.transport_service.assignDriverVehicleForDispatch(payload).subscribe({
            next: (res: any) => {
              Swal.close();
              this.toastr.success(res.message || 'Record updated successfully');
              this.filterGridData(this.tabConfig[isDispatched ? 4 : 5]);
            },
            error: (err) => {
              Swal.close();
              this.toastr.error(err?.error?.message || 'Failed to action. Please try again!');
            }
          });
      }
    });
  }

  goToPOD(row: any) {
    this.openDeliveryRootPopup(row, 'POD');
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  filterGridData(tab: any) {
    this.selectedTab = tab.id;
    this.pageTitle= tab.pageTitle;
    this.rowData = [];
    this.transport_service.getAllVehicleDispatchPlannigList(this.entity_id,tab.queryStatus).subscribe({
      next: (res: any) => {
        this.rowData = res?.data;
      },
      error: (err: any) => {
        this.rowData = [];
      }
    });
  }

}