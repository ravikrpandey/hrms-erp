import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-rate-agreement',
  templateUrl: './rate-agreement.component.html',
  styleUrls: ['./rate-agreement.component.scss']
})
export class RateAgreementComponent {

  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: Number | null;
  financial_year_id: Number | null;
  assignAction: any;
  
  constructor(private accessData: AccessControlService,private toast: ToastrService,
   private route: Router,private transport_service:TransportManagementService,private _rbackService: RbacMasterService
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.getAllData();
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .4
    },
    {
      headerName: 'Agreement No.',
      field: 'agreement_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'Transporter Name',
      field: 'tname',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Agreement Type',
      field: 'agreement_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .7
    },
    {
      headerName: 'Validity (From – To)' ,
      field: 'validity_period',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Total Rate Plan',
      field: 'locationCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .7
    },
    {
      headerName: 'Validity Status',
      field: 'validityStatus',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 0.7,
      cellClass: 'grid-cell-centered',
      cellClassRules: {
        'status-active': (params: { value: string; }) => params.value === 'Active',
        'status-expired': (params: { value: string; }) => params.value === 'Expired'
      }
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: .8,
      cellRenderer: (params: any) => {
        let html = `
          <span class="action-icons" style="color:#00644d; cursor:pointer">
        `;

        if (this.assignAction?.Write) {
          html += `
            <i class="material-icons edit" title="Edit">edit</i>
          `;
        }

        if (this.assignAction?.Read) {
          html += `
            <i class="material-icons view" title="View">visibility</i>
          `;
        }

        if (this.assignAction?.Write) {
          html += `
            <i class="material-icons delete" title="Delete">delete</i>
          `;
        }

        html += `</span>`;

        return html;
      },
      onCellClicked: (params: any) => {
        const target = params.event.target as HTMLElement;
        if (!target?.classList) return;

        if (target.classList.contains('edit')) {
          this.OnClick(params.data.id,'CreateUpdate',params.data.validityStatus);
        } 
        else if (target.classList.contains('view')) {
          this.OnClick(params.data.id,'View',params.data.validityStatus);
        } 
        else if (target.classList.contains('delete')) {
          this.onDelete(params.data.id);
        }
      }
    }
  ];

  onDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          this.transport_service.deleteRateAgreement(id).subscribe(
            (res: any) => {
              this.toast.success(res.message);
              this.getAllData(); // grid refresh
              resolve(res); // ✅ popup close
            },
            (err: any) => {
              this.toast.error(err.error?.message || 'Delete failed');
              Swal.showValidationMessage(
                err.error?.message || 'Something went wrong'
              );
              reject(); // ❌ popup stays open
            }
          );
        });
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellValueChanged(event: CellValueChangedEvent) {

  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  OnClick(id:any, actionType: any, validityStatus: any){
    if(validityStatus=='Expired' && actionType=='CreateUpdate' && id){
      this.toast.error('This rate agreement has expired. Please create a new rate agreement to make changes.');
      return;
    }
    this.route.navigate(['/master/transport-management/create-rate-agreement'],{ queryParams: { id: id, actionType: actionType } });
  }

  getAllData(){
    this.transport_service.getAllRateAgreementList(this.entity_id).subscribe((res:any)=>{
      if(res){
        this.rowData=res.data;
      }
    },(err:any)=>{
      this.rowData=[];
    })
  }
}