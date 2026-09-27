import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-installation-kit-bom',
  templateUrl: './installation-kit-bom.component.html',
  styleUrls: ['./installation-kit-bom.component.scss']
})
export class InstallationKitBomComponent {

  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: any;
  financial_year_id:any;
  assignAction: any;
  
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router, private cryptoService: CryptoService,
    private accessData: AccessControlService, private _rbackService: RbacMasterService
  ) { }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();
    this.assignAction = this._rbackService.accessAssignAction();

    this.getAllData()
  } 

  getAllData = () => {
    this._configurationalMasterService.getBOMList(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    });
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
      flex: .5
    },
    {
      headerName: 'BOM Code',
      field: 'bom_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8
    },
    {
      headerName: 'BOM Name',
      field: 'bom_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
      tooltipValueGetter: (params: any) => params.value || ''
    },
    {
      headerName: 'BOM Price',
      field: 'bom_price',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
      valueFormatter: (params: any) => {
        const value = Number(params.value);
        if (!value) {
          return 'Free';
        }
        return `${value}`;
      }
    },
    {
      headerName: 'HSN Code',
      field: 'hsn_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
      valueFormatter: (params: any) => {
        const value = Number(params.value);
        if (!value) {
          return '-';
        }
        return `${value}`;
      }
    },
    {
      headerName: 'GST',
      field: 'gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5,
      valueFormatter: (params: any) => {
        const value = Number(params.value);
        if (!value) {
          return '-';
        }
        return `${value}%`;
      }
    },
    {
      headerName: 'Ver.',
      field: 'version_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5
    },
    {
      headerName: 'Items',
      field: 'item_count',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1
    },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB');
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .7
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: .7,
      cellRenderer: (params: any) => {
        return `
          <div class="action-icons">
            <i class="fa fa-eye action-icon" data-action="view" title="View Details"></i>

            ${
              this.assignAction?.Write
                ? `<i class="fa fa-edit action-icon" data-action="edit" title="Edit BOM"></i>`
                : ''
            }

            ${
              this.assignAction?.Delete
                ? `<i class="fa fa-trash action-icon" data-action="delete" title="Delete BOM"></i>`
                : ''
            }

            ${
              this.assignAction?.Write && params.data.status === 'Draft'
                ? `<i class="fa fa-check-circle action-icon" data-action="approve" title="Approve BOM"></i>`
                : ''
            }
          </div>
        `;
      }
    }
  ];

  onCellClicked(event: any) {
    if (event.colDef.field !== 'id') {
      return;
    }

    const action = event.event.target.getAttribute('data-action');

    switch (action) {

      case 'view':
       this.viewBOM(event.data);
        break;

      case 'edit':
       this.editBOM(event.data);
        break;

      case 'delete':
       this.deleteBOM(event.data);
        break;

      case 'approve':
        this.openApprovePopup(event.data);
        break;
    }
  }

  viewBOM(row: any) {
    if(Number(row.version_count) > 1){
      let html = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Version</th>
            <th>BOM Name</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
      `;
      row.versions.forEach((item:any)=>{
        html += `
          <tr>
            <td>V${item.version_no}</td>
            <td>${item.bom_name}</td>
            <td>${item.createUser.first_name} [${item.createUser.employee_code}]</td>
            <td>${new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
            <td>${item.status}</td>
            <td>
              <button 
              class="btn btn-sm btn-success viewVersion"
              data-id="${item.id}">
              👁
              </button>
            </td>
          </tr>
        `;
      });
      html += `</tbody></table>`;

      Swal.fire({
        title:"BOM Versions",
        html:html,
        width:"850px",
        showConfirmButton:false
      });

      setTimeout(()=>{
        document.querySelectorAll('.viewVersion')
        .forEach((btn:any)=>{
          btn.onclick=()=>{
            Swal.close();
            this.route.navigate(
              ['/master/configurational-master/create-kit'],
              {
                queryParams:{
                  id:this.cryptoService.encrypt(btn.dataset.id),
                  pageMode:this.cryptoService.encrypt('view')
                }
              }
            );
          }
        });
      },100);
    }else{
      this.route.navigate(
        ['/master/configurational-master/create-kit'],
        {
          queryParams: {
            id: this.cryptoService.encrypt(row.id),
            pageMode: this.cryptoService.encrypt('view')
          }
        }
      );
    }
  }

  editBOM(row: any) {
    this.route.navigate(
      ['/master/configurational-master/create-kit'],
      {
        queryParams: {
          id: this.cryptoService.encrypt(row.id),
          pageMode: this.cryptoService.encrypt('edit')
        }
      }
    );
  }

  deleteBOM(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      html: `
        <p>Do you want to delete this BOM?</p>
        <p>All versions of this BOM will be <strong>deleted</strong>. Existing records linked to this BOM will continue to function normally.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      reverseButtons: true,
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      preConfirm: () => {
        Swal.showLoading();

        return new Promise((resolve, reject) => {
          this._configurationalMasterService.approveBOM({bom_id: row.id, status: 'Delete'}).subscribe({
            next: (res: any) => {
              resolve(res);
            },
            error: (err) => {
              Swal.showValidationMessage(
                err?.error?.message || 'Failed to delete BOM.'
              );
              reject(err);
            }
          });
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'BOM and all its versions have been deleted successfully.'
        });

        // Refresh Grid
        this.getAllData();
      }
    });
  }

  openApprovePopup(row: any) {
    Swal.fire({
      title: 'Approve BOM?',
      html: `
        <p>Do you want to approve this BOM?</p>
        <p>This version will be marked as <strong>Approved</strong>, any existing <strong>Approved</strong> version of the same BOM will be marked as <strong>Inactive</strong>, and all existing linked records will continue to function normally.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve'
    }).then((result) => {

      if (result.isConfirmed) {
        this.approveBOM(row.id);
      }

    });
  }

  approveBOM(id: number) {
    this._configurationalMasterService.approveBOM({bom_id: id, status: 'Approved'}).subscribe({
      next: (res: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || 'BOM Approved Successfully'
        }).then(() => {
          this.getAllData(); // Grid Refresh
        });
      },
      error: (err: any) => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Something went wrong'
        });
      }
    });
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

  createKit(){
    this.route.navigate(['/master/configurational-master/create-kit'])
  }

}