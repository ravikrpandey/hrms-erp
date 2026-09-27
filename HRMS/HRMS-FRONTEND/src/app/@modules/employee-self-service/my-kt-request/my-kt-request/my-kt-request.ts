import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import moment from 'moment';
import { filter } from 'rxjs';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-kt-request',
  templateUrl: './my-kt-request.html',
  styleUrls: ['./my-kt-request.scss']
})
export class MyKtRequest implements OnInit {

  login_id: any;
  entity_Id: any;
  loginUser: any;

  rowData: any = [];
  currentTab: string = 'myRequest';
  gridApi: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private empMaster: EmpMasterService
  ) { }

  ngOnInit() {
    this.loadLocalStorage();
    this.loadTabData('myRequest');  // default

    // Router event to show grid on refresh
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path ?? '';
      });
  }

  loadLocalStorage() {
    const user: any = localStorage.getItem("signInUser");
    const entity: any = localStorage.getItem("selectedEntityId");

    this.loginUser = JSON.parse(user);
    this.entity_Id = JSON.parse(entity);
    this.login_id = this.loginUser?.employee_id;
  }

  // 🚀 LOAD DATA BASED ON CURRENT TAB (4 APIs)
  loadTabData(tab: string) {
    this.currentTab = tab;

    if (tab === 'myRequest') {
      this.empMaster.getMyKtRequests(this.entity_Id, this.login_id)
        .subscribe((res: any) => this.rowData = res.data || []);
    }

    else if (tab === 'pendingForApproval') {
      this.empMaster.getPendingForApproval(this.entity_Id, this.login_id)
        .subscribe((res: any) => this.rowData = res.data || []);
    }

    else if (tab === 'approved') {
      this.empMaster.getApprovedRequests(this.entity_Id, this.login_id)
        .subscribe((res: any) => this.rowData = res.data || []);
    }

    else if (tab === 'rejected') {
      this.empMaster.getRejectedRequests(this.entity_Id, this.login_id)
        .subscribe((res: any) => this.rowData = res.data || []);
    }
  }

  // Tab Click Event
  onTabSelect(tab: string) {
    this.loadTabData(tab);
  }

  // GRID
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    const value = (document.getElementById('filter-text-box1') as HTMLInputElement).value;
    this.gridApi.setQuickFilter(value);
  }

  onCellClicked(event: CellClickedEvent) {
    console.log('Clicked row:', event.data);
  }

  // GRID COLUMNS
  columnDefs: ColDef[] = [
    { headerName: 'S.No', valueGetter: 'node.rowIndex + 1', flex: 1 },

    { headerName: 'KT Category', field: 'category_name', flex: 1 },
    { headerName: 'From Employee', field: 'from_employee_name', flex: 1 },
    { headerName: 'To Employee', field: 'assigned_employee_names', flex: 1 },
    { headerName: 'Created By', field: 'created_by_name', flex: 1 },

    {
      headerName: 'Assigned Date',
      field: 'created_date',
      valueFormatter: p => p.value ? moment.utc(p.value).format("DD/MM/YYYY") : '-',
      flex: 1
    },

    { headerName: 'Remarks', field: 'remarks', flex: 1 },

    {
      headerName: 'Approval Status',
      flex: 1,
      valueGetter: (params) => {
        const data = params.data;

        // My Request → show main status
        if (this.currentTab === 'myRequest') {
          return data.approval_status ?? '-';
        }

        // Other Tabs → employee-level status
        return data.emp_approval_status ?? '-';
      }
    },
  {
  headerName: 'Action',
  flex: 1,
  cellRenderer: (params: any) => {
    // Show icon always on myRequest tab
    if (this.currentTab === 'myRequest') {
      return `<span class="material-icons action-icon">pending_actions</span>`;
    }

    // Show icon for pendingForApproval tab if child not complete
    if (this.currentTab === 'pendingForApproval' && params.data.child_status !== 'COMPLETE') {
      return `<span class="material-icons action-icon">pending_actions</span>`;
    }

    return '-';
  },
  onCellClicked: (params: any) => {
    if (params.event.target.classList.contains('action-icon')) {
      if (this.currentTab === 'myRequest') {
        this.openMyRequestDetails(params.data); // ✅ popup
      } else if (this.currentTab === 'pendingForApproval') {
        this.openApprovalDialog(params.data); // approve/reject
      }
    }
  }
}

];

openMyRequestDetails(row: any) {
  const assignmentId = row.assignment_id || row.id; // fallback to id
  if (!assignmentId) {
    Swal.fire('Error', 'Assignment ID not found', 'error');
    return;
  }

  this.empMaster.getCompletedAssignmentDetails(assignmentId).subscribe(res => {
    const data = res.data;
    if (!data || data.length === 0) {
      Swal.fire('No Data', 'No completed assignment details found.', 'info');
      return;
    }

    // Build child rows in table format
    let childHtml = `
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc; padding:5px; text-align:left;">Approver</th>
            <th style="border:1px solid #ccc; padding:5px; text-align:left;">Status</th>
            <th style="border:1px solid #ccc; padding:5px; text-align:left;">Remarks</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.forEach((c: any) => {
      childHtml += `
        <tr>
          <td style="border:1px solid #ccc; padding:5px;">${c.assigned_employee_name}</td>
          <td style="border:1px solid #ccc; padding:5px;">${c.child_status}</td>
          <td style="border:1px solid #ccc; padding:5px;">${c.child_remark || '-'}</td>
        </tr>
      `;
    });
    childHtml += '</tbody></table>';

    const parentRow = data[0];

    Swal.fire({
      title: 'KT Assignment Details',
      html: `
        ${childHtml}
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Close',
      width: '700px'
    });
  }, (err: any) => {
    console.error(err);
    Swal.fire('Error', 'Failed to fetch assignment details', 'error');
  });
}





 openApprovalDialog(row: any) {
  Swal.fire({
    title: 'Select Action',
    input: 'textarea',
    inputLabel: 'Remarks',
    inputPlaceholder: 'Enter remarks...',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'COMPLETE',  // ✅ match ENUM
    denyButtonText: 'REJECTED',     // ✅ match ENUM
  }).then(result => {
    const approval_remark = result.value || '';
    let approval_status: string;

    if (result.isConfirmed) {
      approval_status = 'COMPLETE';
    } else if (result.isDenied) {
      approval_status = 'REJECTED';
    } else {
      return; // cancel
    }

    const payload = {
      assignment_id: row.id,
      approval_status,   // ✅ matches ENUM
      approval_remark,
      employee_id: this.login_id
    };

    this.empMaster.updateKTApprovalStatus(payload).subscribe({
      next: () => {
        Swal.fire(
          approval_status === 'COMPLETE' ? 'Approved!' : 'Rejected!',
          '',
          approval_status === 'COMPLETE' ? 'success' : 'error'
        );
        this.loadTabData('pendingForApproval');
      },
      error: (err) => console.error(err)
    });
  });
}



}
