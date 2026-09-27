import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryActionComponent } from './delivery-action/delivery-action.component';
import { GridApi } from 'ag-grid-community';
import { DeliveryServicesService } from 'src/app/@shared/services/warehouse/delivery-services.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  constructor(
    private router: Router,
    private tost: ToastrService,
    private deliveryServices: DeliveryServicesService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit() {
    this.getDelivery();
  }
  
  getDelivery() {
    this.deliveryServices.getDeliveryList().subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      }, error: (err) => {
        this.tost.error(err.error.message);
      },
    })
  }
  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .5,
    },
    {
      headerName: 'Vehicle Planning Code',
      field: 'planning_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.1,
    },
    {
      headerName: 'SO No',
      field: 'sales_order_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Invoice No',
      field: 'invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Proposal No',
    //   field: 'proposal_no',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    // {
    //   headerName: 'SO Date',
    //   field: 'sales_order_date',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: .7,
    // },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Customer Name',
    //   field: 'contact_person_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Delivered On',
      field: 'delivered_on_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
    },
    {
      headerName: 'Address',
      field: 'address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      tooltipField: 'address'
    },
    {
      headerName: 'POD Status',
      field: 'dispatch_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .8,
    },
    {
      headerName: 'POD File',
      field: 'file',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .6,
      cellRenderer: (params: any) => {
        if (!params.value) return '';

        const fileName = params.value;
        const fileUrl = `${environment.servralUrl}/uploaded_files/pod_documents/${fileName}`;
        const extension = fileName.split('.').pop().toLowerCase();

        let icon = '';

        switch (extension) {
          case 'pdf':
            icon = `<img src="../../../../assets/icons/pdf-file-type-svgrepo-com.svg" alt="image" style="width: 36px; height: 29px;" />`;
            break;
          // icon = '📄';
          case 'doc':
          case 'docx':
            icon = `<img src="../../../../assets/icons/word-file-type-svgrepo-com.svg" alt="image" style="width: 36px; height: 29px;" />`;
            break;
          // icon = '📝';
          case 'jpg':
          case 'jpeg':
          case 'png':
            icon = `<img src="../../../../assets/icons/images-svgrepo-com.svg" alt="image" style="width: 36px; height: 29px;" />`;
            break;
            // icon = '🖼️';
            // icon = '🖼️';
            break;
          default:
            icon = '📁';
          // icon = '📁'; 
        }

        return `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${icon} </a>`;
      }
    },

    {
      headerName: 'Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: .7,
      cellRenderer: DeliveryActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        refreshGrid: () => {
          this.getDelivery(); // grid reload
        }
      },
    }
  ];
}
