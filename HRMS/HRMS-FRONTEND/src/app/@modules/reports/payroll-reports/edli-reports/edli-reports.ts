import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx-js-style';
import saveAs from 'file-saver';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-edli-reports',
  templateUrl: './edli-reports.html',
  styleUrls: ['./edli-reports.scss']
})
export class EdliReports {


  @ViewChild('filterInput') filterInput!: ElementRef;
    selectedYear: any;
    gridApi!: GridApi;
  
    selectedMonth: any;
    selectedEmployee: any[] = [];
    departmentdata: any[] = [];
    filterDepartment: any[] = [];
    dept_id: any[] = [];
    rowClass = '';
    employeeList: any[] = [];
    filteredEmployees: any[] = [];
    isAllDepartmentSelected = false;
    isAllEmployeeSelected = false;
    entity_id: any;
    rowData: any[] = [];
    financialYearList: any[] = [];
    monthList: any[] = [
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ];
    exportToExceldata: any;
    columnDefs: any;
    entityData: any;
    constructor(
      private toaster: ToastrService,
      private $miscellaneous: MiscellaneousService,
      private http: HttpClient,
      private attendanceService: AttendanceService,
      private entityService: EntityMasterService,
      private services: AttendanceService
    ) { }
  
    ngOnInit(): void {
      const currentDate = new Date();
      this.selectedMonth = currentDate.getMonth() + 1;
      this.selectedYear = currentDate.getFullYear();
      this.getFinancialYear();
      this.entity_id = localStorage.getItem('selectedEntityId');
      this.getDepartments();
    }
  
    generateFun(): void {
      if (!this.selectedYear || !this.selectedMonth) {
        this.toaster.error('Please select Fiscal Year and Pay Period.');
        return;
      }
  
      if (!this.dept_id || this.dept_id.length === 0) {
        this.toaster.error('Please select at least one Department.');
        return;
      }
  
      if (!this.selectedEmployee || this.selectedEmployee.length === 0) {
        this.toaster.error('Please select at least one Employee.');
        return;
      }
  
      const payload = {
        entity_id: this.entity_id,
        employee_ids: this.selectedEmployee,
        month: this.selectedMonth,
        year: this.selectedYear,
      };
  
      console.log('Sending Payload >>>>>', payload);
  
      this.services.getEdliReports(payload).subscribe(
        (res: any) => {
          const responseData = res?.data || [];
          this.entityData = res?.entityData || [];
  
          if (responseData.length === 0) {
            this.toaster.warning('No data found!');
  
            this.rowData = [];
            this.exportToExceldata = [];
  
            if (this.gridApi) {
              this.gridApi.setRowData([]);
              this.gridApi.setColumnDefs([]);
            }
  
            return;
          }
  
          this.rowData = responseData;
          this.exportToExceldata = [...responseData];
  
          // Step 1: Gather all unique keys
          const allKeys = new Set<string>();
          responseData.forEach((item: any) => {
            Object.keys(item).forEach((key) => allKeys.add(key));
          });
  
          // Step 2: Prioritize final 3 fields to move them at the end
          const priorityFields = [
            'Total Gross Earning',
            'Total Gross Deduction',
            'Net pay',
          ];
          const otherFields = Array.from(allKeys).filter(
            (key) => !priorityFields.includes(key)
          );
  
          // Step 3: Build column definitions
          const dynamicColumns = [
            {
              headerName: 'S. No.',
              valueGetter: 'node.rowIndex + 1',
              sortable: true,
              resizable: true,
              cellClass: 'grid-cell-centered',
              flex: 1,
            },
            ...otherFields.map((key) => ({
              headerName: key,
              field: key,
              sortable: true,
              resizable: true,
              wrapHeaderText: true,
              autoHeaderHeight: true,
              cellClass: 'grid-cell-centered',
              flex: 1,
              valueGetter: (params: any) => {
                const value = params.data?.[key];
                return value === null || value === undefined || value === ''
                  ? 'N/A'
                  : value;
              },
            })),
            ...priorityFields
              .filter((key) => allKeys.has(key))
              .map((key) => ({
                headerName: key,
                field: key,
                sortable: true,
                resizable: true,
                wrapHeaderText: true,
                autoHeaderHeight: true,
                cellClass: 'grid-cell-centered',
                flex: 1,
                valueGetter: (params: any) => {
                  const value = params.data?.[key];
                  return value === null || value === undefined || value === ''
                    ? 'N/A'
                    : value;
                },
              })),
          ];
  
          this.columnDefs = dynamicColumns;
  
          // Refresh grid
          if (this.gridApi) {
            this.gridApi.setColumnDefs(this.columnDefs);
            this.gridApi.setRowData(this.rowData);
          }
  
          this.toaster.success('Report generated successfully!');
        },
        (err) => {
          this.toaster.error('Failed to generate report.');
          console.error(err);
        }
      );
    }
  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
    }
  
    getDepartments() {
      this.services.getAllActDeptForReports(this.entity_id).subscribe(
        (res: any) => {
          console.log('API Success', res);
          this.departmentdata = res.data || [];
          this.filterDepartment = [...this.departmentdata];
        },
        (err: any) => {
          this.toaster.error('Failed to load departments');
        }
      );
    }
  
    getAllEmployeesBySelectedDepartments(deptIds: number[]) {
      if (!deptIds || deptIds.length === 0) {
        this.employeeList = [];
        this.filteredEmployees = [];
        return;
      }
  
      this.entityService.getAllEmployeesByDepartment(deptIds).subscribe(
        (res: any) => {
          this.employeeList = res.data || [];
          this.filteredEmployees = [...this.employeeList];
          this.selectedEmployee = []; // Reset selection
          this.isAllEmployeeSelected = false;
        },
        (err: any) => {
          this.toaster.error('Failed to load employees');
        }
      );
    }
  
    checkAlldepartment() {
      this.isAllDepartmentSelected =
        this.dept_id?.length === this.departmentdata?.length;
  
      this.getAllEmployeesBySelectedDepartments(this.dept_id);
    }
  
    selectAllDepartments(event: any) {
      this.isAllDepartmentSelected = event.checked;
      this.dept_id = event.checked
        ? this.departmentdata.map((d) => d.dept_id)
        : [];
  
      this.getAllEmployeesBySelectedDepartments(this.dept_id);
  
      // Reapply grid filter based on text box (if needed)
      this.onFilterTextBoxChanged();
    }
  
    checkAllEmployeeSelected() {
      this.isAllEmployeeSelected =
        this.selectedEmployee.length === this.employeeList.length;
    }
  
    selectAllEmployee(event: any) {
      this.isAllEmployeeSelected = event.checked;
      this.selectedEmployee = event.checked
        ? this.employeeList.map((emp) => emp.employee_id)
        : [];
    }
  
    cancelFun(): void {
      this.selectedYear = null;
      this.selectedMonth = null;
      this.dept_id = [];
      this.selectedEmployee = [];
      this.isAllDepartmentSelected = false;
      this.isAllEmployeeSelected = false;
  
      // Optionally reset filtered lists to original data
      this.filterDepartment = [...this.departmentdata];
      this.filteredEmployees = [...this.employeeList];
  
      this.toaster.info('Data cleared successfully!');
    }
  
    onFilterTextBoxChanged() {
      const value = this.filterInput.nativeElement.value;
      this.gridApi.setQuickFilter(value);
    }
  
    exportToExcel(): void {
      if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
        this.toaster.error('No data found!');
        return;
      }
  
      const entity = this.entityData?.[0] || {};
      const entityName = entity.company_branch ?? 'N/A';
      const employerName = entity.employer_name ?? 'N/A';
      const officeAddress = entity.branch_address ?? 'N/A';
      const registrationNo =
        entity.tax_registration_number === null ||
          entity.tax_registration_number === "null" ||
          entity.tax_registration_number === undefined
          ? "N/A"
          : entity.tax_registration_number;
  
  
      const headerMap: { [key: string]: string } = {};
      const fieldsToExport: string[] = [];
  
      this.columnDefs.forEach((col: any) => {
        if (col.field && col.headerName) {
          headerMap[col.field] = col.headerName;
          fieldsToExport.push(col.field);
        }
      });
  
      const priorityHeaders = [
        'Total Gross Earning',
        'Total Gross Deduction',
        'Net pay',
      ];
      const reorderedFields = fieldsToExport
        .filter((f) => !priorityHeaders.includes(headerMap[f]))
        .concat(
          priorityHeaders
            .map((h) => fieldsToExport.find((f) => headerMap[f] === h))
            .filter(Boolean) as string[]
        );
  
      const exportData = this.exportToExceldata.map((row: any, index: number) => {
        const newRow: any = { 'S.No.': index + 1 };
        reorderedFields.forEach((field) => {
          const header = headerMap[field];
          const value = row[field];
          newRow[header] =
            value === null || value === undefined || value === '' ? 'N/A' : value;
        });
        return newRow;
      });
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
      // Top header rows (A1 - A4 and F1 - F4)
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          ['Name of Establishment', entityName, '', '', '', 'Form '],
          ['Name of Employer', employerName, '', '', '', '[Rule]'],
          ['Address Full', officeAddress, '', '', '', 'EDLI Reports'],
          ['Registration No.', registrationNo],
          [], // Empty line before table
        ],
        { origin: 'A1' }
      );
      ['A1', 'A2', 'A3', 'A4',].forEach((cell) => {
        if (worksheet[cell]) {
          worksheet[cell].s = { font: { bold: true } };
        }
      });
  
      const tableHeaders = ['S.No.', ...reorderedFields.map((f) => headerMap[f])];
      XLSX.utils.sheet_add_aoa(worksheet, [tableHeaders], { origin: `A6` });
      tableHeaders.forEach((_, idx) => {
        const cellRef = XLSX.utils.encode_cell({ r: 5, c: idx }); // row 6 (0-based index=5)
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = { font: { bold: true } };
        }
      });
      XLSX.utils.sheet_add_json(worksheet, exportData, {
        skipHeader: true,
        origin: `A7`,
      });
  
      // Column width autosize
      worksheet['!cols'] = tableHeaders.map((header) => ({
        wch: header.length + 5,
      }));
  
      const workbook: XLSX.WorkBook = {
        Sheets: { Data: worksheet },
        SheetNames: ['Data'],
      };
  
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
  
      const dataBlob: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
  
      saveAs(
        dataBlob,
        `EDLI_Report.xlsx`
      );
    }
  
    getFinancialYear(): void {
      this.$miscellaneous.getAllActivefinancial_year().subscribe(
        (res: any) => {
          this.financialYearList = res?.data || [];
          this.financialYearList.forEach((item: any) => {
            item.financial_year = item.financial_year;
          });
        },
        (err) => {
          console.error('Error fetching financial years', err);
          this.toaster.error('Failed to load financial years');
        }
      );
    }
  


}
