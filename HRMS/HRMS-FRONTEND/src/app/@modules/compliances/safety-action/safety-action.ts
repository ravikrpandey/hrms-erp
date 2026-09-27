import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { CompliancesService } from '../compliances-service';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-safety-action',
  templateUrl: './safety-action.html',
  styleUrls: ['./safety-action.scss'],
})
export class SafetyAction {
  assignAction: any;
  locations: any[] = [];
  getAllDepartment2: any[] = [];
  employeeList2: any[] = [];

  constructor(private route: Router,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private toast: ToastrService,
    private _compliancesservice: CompliancesService,
    private _rbackService: RbacMasterService,
    private configMaster: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.loadMasterData();
  }
  public cellValue: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  singleData: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.valueFormatted ? params.valueFormatted : params.data.service_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/compliances/safety/create'], {
      queryParams: {
        actionType: 'edit',
        id: this.singleData?.id,
        entity_id: this.singleData?.entity_id
      }
    })
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this._compliancesservice.deleteSafetyInspection(this.singleData?.id).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toast.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toast.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  }

  openDialog() {
    this.route.navigate(['master/compliances/safety/create'], {
      queryParams: {
        id: this.singleData?.id,
        entity_id: this.singleData?.entity_id, actionType: 'view'
      }
    })
  }
  // Load master data for dropdowns
  loadMasterData() {
    const entity_id = localStorage.getItem("selectedEntityId");

    // Load branches
    this.configMaster.branch_get_active().subscribe(
      (params: any) => {
        const data = params.data;
        this.locations = Array.isArray(data) ? data : [data];
      },
      (err) => {
        console.error('Error loading branches:', err);
      }
    );

    // Load departments
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {
        this.getAllDepartment2 = res.data.filter((res: any) => res.status === "ACTIVE");
      },
      (err) => {
        console.error('Error loading departments:', err);
      }
    );

    // Load employees
    this._empRegistration.getAllEmployeeWithCode().subscribe(
      (res: any) => {
        if (res) {
          this.employeeList2 = res.data;
        }
      },
      (err) => {
        console.error('Error loading employees:', err);
      }
    );
  }
  download(e: any) {
    e.stopPropagation();

    // Show loader
    this._commonService?.showLoader();

    const entity_id = this.singleData?.entity_id || localStorage.getItem("selectedEntityId");

    // Fetch all required data in parallel
    forkJoin({
      safetyData: this._compliancesservice.getSafetyInspectionById(entity_id, this.singleData?.id),
      branches: this.configMaster.branch_get_active(),
      departments: this._empRegistration.getAllDepartment_dropDown(entity_id),
      employees: this._empRegistration.getAllEmployeeWithCode()
    }).subscribe(
      (results: any) => {
        this._commonService?.hideLoader();

        if (results.safetyData && results.safetyData.data && results.safetyData.data.length > 0) {
          // Update master data
          const branchData = results.branches.data;
          this.locations = Array.isArray(branchData) ? branchData : [branchData];

          this.getAllDepartment2 = results.departments.data.filter((res: any) => res.status === "ACTIVE");

          this.employeeList2 = results.employees.data;

          // Generate Excel with the fetched data
          const response = results.safetyData.data[0];
          this.generateExcel(response);
        } else {
          this.toast.error('No data found for download', 'Error');
        }
      },
      (err) => {
        this._commonService?.hideLoader();
        this.toast.error('Error fetching data for download', 'Error');
        console.error('Download error:', err);
      }
    );
  }

  generateExcel(data: any) {
    try {
      // Parse remarks and checkpoints
      let checkpoints = [];
      try {
        if (data?.remarks) {
          const parsedRemarks = typeof data.remarks === 'string'
            ? JSON.parse(data.remarks)
            : data.remarks;
          checkpoints = parsedRemarks?.checkpoints || [];
        }
      } catch (e) {
        console.error('Error parsing remarks:', e);
      }

      // Get branch name from API data
      const selectedBranch = this.locations?.find((l: any) => l.id === data.branch_id);
      const branchName = selectedBranch?.branch_name || data.branch_name || 'N/A';

      // Get department names from API data
      let deptIds: any[] = [];
      if (data.department_id) {
        // Handle both array and single value
        deptIds = Array.isArray(data.department_id) ? data.department_id : [data.department_id];
      }

      const deptNames = this.getAllDepartment2
        ?.filter((d: any) => deptIds.includes(d.dept_id))
        .map((d: any) => d.department_name)
        .join(', ') || 'N/A';

      // Get employee name from API data
      const selectedEmp = this.employeeList2?.find((e: any) => e.employee_id === data.employee_id);
      const employeeName = selectedEmp
        ? `${selectedEmp.first_name} ${selectedEmp.middle_name || ''} ${selectedEmp.last_name} ${selectedEmp.employee_code}`.trim()
        : data.employee_name || 'N/A';

      // Format date
      let inspectionDate = 'N/A';
      if (data.date_of_inspec) {
        const date = new Date(data.date_of_inspec);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          inspectionDate = `${day}-${month}-${year}`;
        }
      }

      // Calculate inspection status from checkpoints
      const statusCounts = {
        yes: checkpoints.filter((i: any) => i.status === 'Yes').length,
        no: checkpoints.filter((i: any) => i.status === 'No').length,
        na: checkpoints.filter((i: any) => i.status === 'NA').length,
      };

      let inspectionStatus = 'YES';
      if (statusCounts.no > 0) inspectionStatus = 'NO';
      else if (statusCounts.yes === 0 && statusCounts.na > 0) inspectionStatus = 'NA';

      // Create Excel data structure
      const headerData = [
        ['SAFETY CONDITIONS INSPECTION REPORT'],
        [],
        ['Branch:', branchName],
        ['Date of Inspection:', inspectionDate],
        ['Department(s) Inspected:', deptNames],
        ['Inspected By:', employeeName],
        ['Supervisor Present:', data.supervisor || 'N/A'],
        [],
        ['SAFETY CONDITIONS INSPECTION CHECKLIST'],
        []
      ];

      // Create checklist table headers
      const checklistHeaders = [['S.No', 'Checkpoint', 'Status', 'Remarks']];

      // Create checklist data rows
      const checklistData = checkpoints.map((item: any, index: number) => [
        (index + 1).toString(),
        item.checkpoint || '',
        item.status || '',
        item.remarks || ''
      ]);

      // Combine all data
      const finalData = [...headerData, ...checklistHeaders, ...checklistData];

      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);

      // Set column widths
      ws['!cols'] = [
        { wch: 8 },   // S.No
        { wch: 55 },  // Checkpoint
        { wch: 12 },  // Status
        { wch: 40 }   // Remarks
      ];

      // Merge cells for title and headers
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
        { s: { r: 9, c: 0 }, e: { r: 9, c: 3 } }  // Checklist header
      ];

      // Create workbook and add worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Safety Inspection');

      // Generate filename with date and branch
      const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const sanitizedBranchName = branchName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Safety_Compliances_Inspection_${sanitizedBranchName}_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      this.toast.success('Excel file downloaded successfully!', 'Success');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      this.toast.error('Error downloading Excel file', 'Error');
    }
  }
}
