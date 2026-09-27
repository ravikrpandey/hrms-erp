import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ExcelService } from './excel_service/excel.service';
import { ToastrService } from 'ngx-toastr';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.scss'],
})
export class ExcelUploadComponent implements OnInit {
  modelNames = ['Payroll Attendance Data', 'Employee Data'];
  selectedModel: string = '';
  file: File | null = null;
  financial_year_id: any;
  entity_id: any;
  entityData: any;
  countryList: any;
  filtercountryList: any[];
  stateList: any;
  filterState: any[];
  reportingManagerList: string[];
  branchList: any;
  departmentdata: any;
  filteredDepartments: any[];
  allCity: any;
  designationList: any;
  employeeWithCode: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  financialYearList: any;
  filterFinancialYearList: any[];

  constructor(
    private excel_service: ExcelService,
    private toast: ToastrService,
    private entityService: EntityMasterService,
    private travelRequest: TravelRequestService,
    private _empRegistration: EmpRegistrationService,
    private payrollService: PayrollService,
    private assessmentService: YearlyAssessmentService,
    private itticketingService: ItticketingService,
    private configMaster: ConfigurationalmasterService,
    private $miscellaneous: MiscellaneousService,
  ) { }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getAllEntity();
    this.getAllCountry();
    this.getAllstates();
    this.getAllDepartmentData();
    this.getAllBranchList();
    this.getAllCity();
    this.getAllManagerList();
    this.getDesignations();
    this.getAllEmployeeWithCodeList();
    this.getFinancialYear();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
    }
  }
  downloadSample() {
    if (this.selectedModel === 'Employee Data') {
      this.downloadSampleExcel();
    } else if (this.selectedModel === 'Payroll Attendance Data') {
      this.downloadSampleExcelForAttendance();
    } else {
      this.toast.warning('Please select a model first');
    }
  }
  upload() {
    if (!this.file || !this.selectedModel) {
      this.toast.warning('Please select a model and upload a file');
      return;
    }

    if (this.selectedModel === 'Employee Data') {
      this.uploadEmployeeFile();
    } else if (this.selectedModel === 'Payroll Attendance Data') {
      this.uploadAttendanceFile();
    } else {
      this.toast.warning('Upload only works for Employee Data or Attendance Data');
    }
  }

  uploadEmployeeFile() {
    if (!this.file || !this.selectedModel) {
      this.toast.warning('Please select a model and upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    formData.append('entity_id', this.entity_id);
    formData.append('financial_year_id', this.financial_year_id);
    formData.append('model', this.selectedModel);
    // API call
    this.excel_service.uploadEmployeeExcel(formData).subscribe({
      next: (res: any) => {
        this.toast.success('File uploaded successfully!');
        this.file = null;
        this.selectedModel = '';
        this.fileInput.nativeElement.value = '';
      },
      error: (err: any) => {
        console.error(err);
        this.toast.error('Something went wrong, please try again.');
      },
    });
  }
  uploadAttendanceFile() {
    if (!this.file || !this.selectedModel) {
      this.toast.warning('Please select a model and upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file, this.file.name);
    formData.append('entity_id', this.entity_id);
    formData.append('financial_year_id', this.financial_year_id);
    formData.append('model', this.selectedModel);

    // API call
    this.excel_service.uploadAttendanceExcel(formData).subscribe({
      next: (res: any) => {
        this.toast.success('File uploaded successfully!');
        this.file = null;
        this.selectedModel = '';
        this.fileInput.nativeElement.value = '';
      },
      error: (err: any) => {
        console.error(err);
        this.toast.error(err);
      },
    });
  }

  getAllEntity() {
    try {
      this.entityService.getEntityList().subscribe((response: any) => {
        if (response) {
          this.entityData = response.data
        }
      }, (err: any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  getAllCountry() {
    this.travelRequest.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.filtercountryList = [...this.countryList]
      })
  };
  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {

      if (res) {
        this.financialYearList = res?.data;
        this.filterFinancialYearList = [...this.financialYearList]
      }
    })
  }
  getAllstates() {
    this.travelRequest.getAllstates().subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.filterState = [...this.stateList]
      })
  };
  getDesignations() {
    this.configMaster.getAllDesignation_active().subscribe((res: any) => {
      this.designationList = res.data;
    })
  }
  getAllCity() {
    this.itticketingService.getCityMyExpense().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.allCity = res.data;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
  getAllBranchList() {
    this.payrollService.getAllBranch().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.branchList = res.data;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }
  getAllManagerList() {
    this._empRegistration.getAllManagersList().subscribe((res: any) => {
      this.reportingManagerList = res.data;

    })
  }
  getAllEmployeeWithCodeList() {
    this._empRegistration.getAllEmployeeWithCode().subscribe((res: any) => {
      this.employeeWithCode = res.data;

    })
  }
  getAllDepartmentData() {
    const selectedEntityId = localStorage.getItem('selectedEntityId');
    this.assessmentService.getAllDepartmentData(selectedEntityId).subscribe(
      (res: any) => {
        this.departmentdata = res.data.departments;
        this.filteredDepartments = [...this.departmentdata];

      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  async downloadSampleExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Data');

    // Define column headers
    const columns = [
      { header: 'Title', key: 'title', width: 25 },
      // { header: 'Employee Number', key: 'employee_code', width: 30 },
      { header: 'First Name', key: 'first_name', width: 30 },
      { header: 'Middle Name', key: 'middle_name', width: 25 },
      { header: 'Last Name', key: 'last_name', width: 25 },
      { header: 'Entity', key: 'primary_entity_id', width: 25 },
      { header: 'Gender', key: 'gender', width: 25 },
      { header: 'Date Of Birth', key: 'date_of_birth', width: 30 },
      { header: 'Country', key: 'country_code', width: 25 },
      { header: 'State', key: 'employee_state_id', width: 30 },
      { header: 'City', key: 'employee_city_id', width: 25 },
      { header: 'Personal Email Id', key: 'emp_personal_email', width: 30 },
      { header: 'Official Email Id', key: 'employee_official_email', width: 30 },
      { header: 'Contact Number', key: 'contact_number', width: 30 },
      { header: 'Official Contact Number', key: 'official_contact_number', width: 30 },
      { header: 'Reporting Manager', key: 'reporting_manager_id', width: 25 },
      { header: 'Approval Manager', key: 'approval_manager_id', width: 25 },
      { header: 'Primary Branch', key: 'primary_branch_id', width: 20 },
      { header: 'Department', key: 'department_id', width: 25 },
      { header: 'Employment Type', key: 'employment_type_id', width: 30 },
      { header: 'Date Of Joining', key: 'emp_join_date', width: 30 },
      { header: 'Date Of Probation', key: 'emp_probation_date', width: 30 },
      { header: 'ESIC Number', key: 'ESIC_number', width: 30 },
      { header: 'Designation', key: 'designation_id', width: 30 },
      { header: 'Status', key: 'status', width: 30 },
      { header: 'Handicapped', key: 'isHandiCap', width: 30 },
    ];



    worksheet.columns = columns;
    worksheet.getRow(1).font = { bold: true };

    // Dropdown source data
    const title = ['Mr', 'Mrs', 'Miss'];
    const entity = this.entityData.map((c: any) => c.entity_name);
    const gender = ['male', 'female', 'other'];
    const country = this.filtercountryList.map((c: any) => c.countryss_name);
    const states = this.filterState.map((c: any) => c.states_name);
    const branch = this.branchList.map((branch: any) => branch.branch_name)
    const designations = this.designationList.map((value: any) => value.designation_name)
    const department = this.filteredDepartments.map((c: any) => c.department_name);
    const cities = this.allCity.map((c: any) => c.city_name);
    const manager = this.reportingManagerList.map((c: any) => `${c.first_name} ${c.last_name}`);
    const employmentType = ['Permanent', 'Part Time', 'Internship'];
    const status = ['ACTIVE', 'INACTIVE'];
    const handicapped = [0, 1];


    // Prefill one row of sample data
    worksheet.getRow(2).values = [
      , // skip index 0
      title[0] || 'Mr',
      '',//fname
      '',//middle name
      '',//last name
      entity[0],
      gender[0],
      '',
      country[0],
      states[0],
      cities[0],
      '',//personal email
      '',//official email
      '',//contact number
      '',//official contact number
      manager[0],
      manager[0],
      branch[0],
      department[0],
      employmentType[0] || '',
      '',//doj
      '',//dop
      '',//esic number
      designations[0],
      status[0] || '',
      handicapped[0] || '',
    ];

    // Prefill empty rows to apply validation
    for (let i = 3; i <= 1000; i++) {
      worksheet.getRow(i).getCell('B').value = '';
      worksheet.getRow(i).getCell('F').value = '';
      worksheet.getRow(i).getCell('G').value = '';
      worksheet.getRow(i).getCell('E').value = '';
      worksheet.getRow(i).getCell('H').value = '';
      worksheet.getRow(i).getCell('J').value = '';
      worksheet.getRow(i).getCell('N').value = '';
      worksheet.getRow(i).getCell('U').value = '';
    }

    // Hidden options sheet for dropdowns
    //for inside dropdown options
    const optionsSheet = workbook.addWorksheet('Options');
    optionsSheet.state = 'veryHidden';

    optionsSheet.getColumn(1).values = [null, ...title];
    optionsSheet.getColumn(5).values = [null, ...entity];
    optionsSheet.getColumn(6).values = [null, ...gender];
    optionsSheet.getColumn(8).values = [null, ...country];
    optionsSheet.getColumn(9).values = [null, ...states];
    optionsSheet.getColumn(10).values = [null, ...cities];
    optionsSheet.getColumn(15).values = [null, ...manager];
    optionsSheet.getColumn(16).values = [null, ...manager];
    optionsSheet.getColumn(17).values = [null, ...branch];
    optionsSheet.getColumn(18).values = [null, ...department];
    optionsSheet.getColumn(19).values = [null, ...employmentType];
    optionsSheet.getColumn(23).values = [null, ...designations];
    optionsSheet.getColumn(24).values = [null, ...status];
    optionsSheet.getColumn(25).values = [null, ...handicapped];

    // Define ranges, for drop down arrow
    const titleRange = `=Options!$A$2:$A$${title.length + 1}`;
    const entityRange = `=Options!$E$2:$E$${entity.length + 1}`;
    const genderRange = `=Options!$F$2:$F$${gender.length + 1}`;
    const countryRange = `=Options!$H$2:$H$${country.length + 1}`;
    const stateRange = `=Options!$I$2:$I$${states.length + 1}`;
    const cityRange = `=Options!$J$2:$J$${cities.length + 1}`;
    const reportingManagerRange = `=Options!$O$2:$O$${manager.length + 1}`;
    const approvalManagerRange = `=Options!$P$2:$P$${manager.length + 1}`;
    const branchesRange = `=Options!$Q$2:$Q$${branch.length + 1}`;
    const departmentRange = `=Options!$R$2:$R$${department.length + 1}`;
    const employmentRange = `=Options!$S$2:$S$${employmentType.length + 1}`;
    const designationRange = `=Options!$W$2:$W$${designations.length + 1}`;
    const statusRange = `=Options!$X$2:$X$${status.length + 1}`;
    const handicappedRange = `=Options!$Y$2:$Y$${handicapped.length + 1}`;

    // Apply dropdowns to correct columns
    const dropdownMap = [
      { col: 'A', range: titleRange },
      { col: 'E', range: entityRange },
      { col: 'F', range: genderRange },
      { col: 'H', range: countryRange },
      { col: 'I', range: stateRange },
      { col: 'J', range: cityRange },
      { col: 'O', range: reportingManagerRange },
      { col: 'P', range: approvalManagerRange },
      { col: 'Q', range: branchesRange },
      { col: 'R', range: departmentRange },
      { col: 'S', range: employmentRange },
      { col: 'W', range: designationRange },
      { col: 'X', range: statusRange },
      { col: 'Y', range: handicappedRange },
    ];
    dropdownMap.forEach(({ col, range }) => {
      worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber >= 2) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [range],
            showErrorMessage: true,
            errorTitle: 'Invalid Selection',
            error: `Please select a valid value`,
          };
        }
      });
    });


    // Export the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, `employee_sample.xlsx`);
  }

  async downloadSampleExcelForAttendance() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payroll Attendance Data');

    // Define column headers
    const columns = [
      { header: 'Select Employee', key: 'employee', width: 40 },
      { header: 'Present Days', key: 'total_P', width: 18 },
      { header: 'Absent Days', key: 'total_A', width: 15 },
      { header: 'Unpaid Leaves', key: 'total_UL', width: 20 },
      { header: 'Half Days', key: 'total_HD', width: 15 },
      { header: 'Unpaid Half Leaves', key: 'total_UHL', width: 25 },
      { header: 'Week Off Full Day', key: 'total_WFO', width: 28 },
      { header: 'Week Off Half Day', key: 'total_WHO', width: 28 },
      { header: 'Paid Leave Full Day', key: 'total_PFD', width: 30 },
      { header: 'Paid Leave Half Day', key: 'total_PHD', width: 30 },
      { header: 'Half Paid Leave Full Day', key: 'total_HPFD', width: 35 },
      { header: 'Half Paid Leave Half Day', key: 'total_HPHD', width: 35 },
      { header: 'Non Paid Leave Full Day', key: 'total_NPFD', width: 35 },
      { header: 'Non Paid Leave Half Day', key: 'total_NPHD', width: 35 },
      { header: 'Holiday', key: 'total_H', width: 20 },

      { header: 'Attendance Month', key: 'att_month', width: 20 },
      { header: 'Salary Process Month', key: 'salary_process_month', width: 28 },
      { header: 'Attendance Year', key: 'att_year', width: 22 },
      { header: 'Payroll Cycle Start Date', key: 'payroll_cycle_start_date', width: 32 },
      { header: 'Payroll Cycle End Date', key: 'payroll_cycle_end_date', width: 32 },
      { header: 'Total Days In Months', key: 'working_days', width: 20 },
      { header: 'Total Paid Days', key: 'total_present_day', width: 28 },
      { header: 'Financial Year', key: 'financial_year', width: 22 },
      // { header: 'Status', key: 'status', width: 15 },
    ];

    worksheet.columns = columns;
    worksheet.getRow(1).font = { bold: true };

    const employeesList = this.employeeWithCode.map((c: any) => `${c.first_name} ${c.last_name} ${c.employee_code}`
    );
    const daysInMonth = [28, 29, 30, 31];

    const financialYear = this.filterFinancialYearList.map((c: any) => c.financial_year)
    // Prefill one row of sample data
    worksheet.getRow(2).values = [
      , // skip index 0
      employeesList[0],
      '',//present days
      0,//absent days
      '',//unpaid leaves
      '',//half days
      '',//Unpaid Half Leaves
      '',//Week Off Full Day
      '',//Week Off Half Day
      '',//Paid Leave Full Day
      '',//Paid Leave Half Day
      '',//Half Paid Leave Full Day
      '',//Half Paid Leave Half Day
      '',//Non Paid Leave Full Day
      '',//Non Paid Leave Half Day
      '',//Holiday
      '',//Attendance Month
      '',//Salary Process Month
      '',//Attendance Year
      '',//Payroll Cycle Start Date
      '',//Payroll Cycle End Date
      daysInMonth[0],
      '',//Total Paid Days
      financialYear[0],
      // statusList[0],

    ];

    for (let i = 3; i <= 1000; i++) {
      worksheet.getRow(i).getCell('C').value = '';
      worksheet.getRow(i).getCell('G').value = '';
      worksheet.getRow(i).getCell('H').value = '';
      worksheet.getRow(i).getCell('F').value = '';
      worksheet.getRow(i).getCell('I').value = '';
      worksheet.getRow(i).getCell('K').value = '';
      worksheet.getRow(i).getCell('O').value = '';
      worksheet.getRow(i).getCell('U').value = '';
      worksheet.getRow(i).getCell('W').value = '';
    }

    // Hidden options sheet for dropdowns
    const optionsSheet = workbook.addWorksheet('Options');
    optionsSheet.state = 'veryHidden';

    // optionsSheet.getColumn(22).values = [null, ...statusList];
    optionsSheet.getColumn(1).values = [null, ...employeesList];
    optionsSheet.getColumn(21).values = [null, ...daysInMonth];
    optionsSheet.getColumn(23).values = [null, ...financialYear];

    // Define ranges
    // const statusRange = `=Options!$V$2:$V$${statusList.length + 1}`;
    const employeeRange = `=Options!$A$2:$A$${employeesList.length + 1}`;
    const daysInMonthRange = `=Options!$U$2:$U$${daysInMonth.length + 1}`;
    const financialYearRange = `=Options!$W$2:$W$${financialYear.length + 1}`;
    // Apply dropdowns
    const dropdownMap = [
      // { col: 'V', range: statusRange },
      { col: 'A', range: employeeRange },
      { col: 'U', range: daysInMonthRange },
      { col: 'W', range: financialYearRange },
    ];
    dropdownMap.forEach(({ col, range }) => {
      worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber >= 2) {
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [range],
            showErrorMessage: true,
            errorTitle: 'Invalid Selection',
            error: `Please select a valid value`,
          };
        }
      });
    });
    // Sum of present and other days for total month days 
    // worksheet.getColumn('T').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    //   if (rowNumber >= 2) {
    //     cell.dataValidation = {
    //       type: 'custom',
    //       formulae: [
    //         `=(A${rowNumber}+B${rowNumber}+C${rowNumber}+(D${rowNumber}/2)+(E${rowNumber}/2)+F${rowNumber}+(G${rowNumber}/2)+(I${rowNumber}/2)+H${rowNumber}+(J${rowNumber}/2)+(k${rowNumber}/4)+(M${rowNumber}/2)+L${rowNumber})=T${rowNumber}`
    //       ],
    //       showErrorMessage: true,
    //       errorTitle: 'Invalid Working Days',
    //       error: 'The sum of all leave/attendance fields (with half days as 0.5) must equal Working Days',
    //     };
    //   }
    // });
    // worksheet.getColumn('U').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
    //   if (rowNumber >= 2) {
    //     cell.dataValidation = {
    //       type: 'custom',
    //       formulae: [
    //         `=(A${rowNumber}+H${rowNumber}+J${rowNumber}+F${rowNumber}+(I${rowNumber}/2)+(K${rowNumber}/2)+(G${rowNumber}/2)+N${rowNumber})=U${rowNumber}`
    //       ],
    //       showErrorMessage: true,
    //       errorTitle: 'Invalid Paid Days',
    //       error: 'The sum of all present,pfd,phd,hpfd,hphd,wfo,who,holiday fields (with half days as 0.5) must equal Total paid Days',
    //     };
    //   }
    // });

    worksheet.getColumn('P').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber >= 2) {
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"1,2,3,4,5,6,7,8,9,10,11,12"'],
          showErrorMessage: true,
          errorTitle: 'Invalid Month',
          error: 'Please select a number between 1 and 12',
        };
        cell.numFmt = '0'; // keep it as plain number, not date
      }
    });


    worksheet.getColumn('T').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber >= 2) {
        cell.dataValidation = {
          type: 'date',
          operator: 'between',
          formulae: [new Date(2020, 0, 1), new Date(2030, 11, 31)], // allowed range
          showErrorMessage: true,
          errorTitle: 'Invalid Date',
          error: 'Enter a valid date (YYYY-MM-DD)',
        };
        cell.numFmt = 'yyyy-mm-dd'; // force format
      }
    });
    worksheet.getColumn('S').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber >= 2) {
        cell.dataValidation = {
          type: 'date',
          operator: 'between',
          formulae: [new Date(2020, 0, 1), new Date(2030, 11, 31)], // allowed range
          showErrorMessage: true,
          errorTitle: 'Invalid Date',
          error: 'Enter a valid date (YYYY-MM-DD)',
        };
        cell.numFmt = 'yyyy-mm-dd'; // force format
      }
    });
    const dayCols = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Q','R'];
    dayCols.forEach(col => {
      worksheet.getColumn(col).eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber >= 2) {
          cell.dataValidation = {
            type: 'whole',
            operator: 'greaterThanOrEqual',
            formulae: [0],
            showErrorMessage: true,
            errorTitle: 'Invalid Number',
            error: 'Please enter a valid integer (>=0)',
          };
        }
      });
    });
    worksheet.getColumn('V').eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber >= 2) {
        cell.dataValidation = {
          type: 'custom',
          formulae: [`=V${rowNumber}<=U${rowNumber}`],
          showErrorMessage: true,
          errorTitle: 'Invalid Value',
          error: ' Total paid days (V) cannot be greater than Total days in months (U)',
        };
      }
    });



    // Export the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    FileSaver.saveAs(blob, `attendance_sample.xlsx`);
  }


}
