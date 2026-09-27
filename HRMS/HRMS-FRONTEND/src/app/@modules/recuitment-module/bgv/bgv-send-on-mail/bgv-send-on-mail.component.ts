import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { CondidateProfileAction } from '../../condidate-profile/condidate-profile-action/condidate-profile-action.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { BgvService } from 'src/app/@shared/services/service/recruitment/bgv.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bgv-send-on-mail',
  templateUrl: './bgv-send-on-mail.component.html',
  styleUrls: ['./bgv-send-on-mail.component.scss']
})
export class BgvSendOnMailComponent {

  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  jobIdNew: any;
  assignAction: any;
  entity_id: string | null;
  user_id: any;
  userDetails: any = {};
  departments: any;
  navWidth: number = 0;
  // dateFormatter: any;
  public gridOptions: any = { rowSelection: 'multiple', };

  bgvMailForm: any;
  baseUrl: any;
  baseHref: any;
  rowDataJob: any;
  candidate_id: any;

  minToDate: Date;
  today: Date = new Date();


  constructor(
    private location: Location,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _rbackService: RbacMasterService,
    private $jobDescription: JobDescriptionService,
    private recruitService: RecruitService,
    private configMaster: ConfigurationalmasterService,
    private $condidateProfile: CondidateProfileService,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private $bgv: BgvService,
    private route: ActivatedRoute,
  ) {
    this.baseUrl = environment.serverUrl;
    this.baseHref = environment.baseHref;
    this.rowClass = 'rowClass';

    this.bgvMailForm = this.fb.group({
      // candidate_email: new FormControl(null, [Validators.required, Validators.email]),
      candidate_description: new FormControl(null),

      //family Details
      company_details: new FormArray([
        new FormGroup({
          company_name: new FormControl(null),
          company_email: new FormControl(null, [Validators.required, Validators.email]),
          start_date: new FormControl(null),
          end_date: new FormControl(null),
        }),
      ]),

    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);

    this.route.queryParams.subscribe((params: any) => {

      this.candidate_id = params?.id;
      if (this.candidate_id) {
        this.getAll_candidate_profile();
      }
    });

  }


  getAll_candidate_profile() {

    const userData: any = localStorage.getItem('signInUser');
    const userDetail = JSON.parse(userData);
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");

    let query = {
      user_id: userDetail?.employee_id,
      entity_id: entity_id,
      user_role: userDetail?.role,
      financial_year_id: financial_id,
    }

    this.$condidateProfile.getAll_candidate_profile(query).subscribe((res: any) => {
      console.log(res);

      this.rowDataJob = res.data;
    })
  }

  approvedJdList: any = [];
  getApprovedJob() {

    let entity_id = localStorage.getItem("selectedEntityId");
    this.$jobDescription.get_all_approved_jobrequest(entity_id).subscribe((res: any) => {
      if (res) {
        this.approvedJdList = res?.data;
      }
    })
  }

  getAllJobRequest() {
    this.recruitService.getApprovedJobRequest().subscribe((res: any) => {
      console.log(res, 'resss');

    })
  }
  getDepartment() {
    this.configMaster.getAllDepartment_all_active(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    })
  }
  getAllAreas(e: any) {

  }
  openNav() {

    this.navWidth = 400;
  }

  closeNav() {
    this.navWidth = 0;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }
  getRecruitListData() {
    this.recruitService.getRecruitList().subscribe((res: any) => {
      let data: any = [];
      for (let val of res.data) {
        let format: any = {
          id: val.id,
          job_title: val.job_title,
          description: val.description,
          FK_vertical_id: val.FK_vertical_id,
          job_role: val.job_role,
          vertical_name: val.vertical?.vertical_name,
          department: val.department,
          createdAt: val.createdAt,
          job_type: val.job_type?.job_type,
          experience: val.experience,
          number_of_positions: val.number_of_positions,
          location: val.location,
          requisition_status: val.requisition_status,
          spoc_name: val.spoc_name,
          status: val.status,
          end_date: val.end_date,
        }
        data.push(format);
        // 
        console.log(data, 'data');

      }
      this.rowData = data;
      // 
    })
  }
  public columnDefs = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'JD ID',
      field: 'jd_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Position ',
      field: 'designation_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Department',
      field: 'department_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Contract Type',
      field: 'contract_type', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Location',
      field: 'branch_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CondidateProfileAction,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  // popup
  public columnDefsJob = [
    {
      headerName: 'S.No',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'JD ID',
      field: 'jd_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Job Position ',
      field: 'designation_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Department',
      field: 'department_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Location',
      field: 'branch_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CondidateProfileAction,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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

  onCellClicked(e: any) {
    // this.jobIdNew = e.data.id;

    // localStorage.setItem("jobId", this.jobIdNew);
    // // this.router.navigate(['hrms/recruitment-module/job-description/job-description-list/action.component'], { queryParams: { job_id: this.jobIdNew } })
    // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { jobId: this.jobIdNew } });
    // dialogRef.afterClosed().subscribe((result: any) => {

    // })
  }

  // Family

  get CF_1(): any {
    return this.bgvMailForm.controls;
  };

  addRow() {
    const company_details = this.bgvMailForm.get('company_details') as FormArray;
    if (company_details.value && company_details?.value.length > 0) {
      let canAddNewRow = true;

      for (const obj of company_details?.value) {
        if (!obj.company_name) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        // Logic to add a new row

        const company_details = this.bgvMailForm.get('company_details') as FormArray;
        this.CF_1.company_details.push(
          new FormGroup({
            company_name: new FormControl(null),
            company_email: new FormControl(null),
            start_date: new FormControl(null),
            end_date: new FormControl(null),
          })
        )


        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please add Company Details first');
        // Display an error message for the user
      }
    } else {

    }

  }

  deletecompany_details(i: number, d: any) {
    if (this.CF_1.company_details.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want be delete !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#858586',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.company_details.length >= 1) {
            this.CF_1.company_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  // File upload start
  fileUrl: any;

  uploadedFileUrls: string[] = [];  // Array to store the file URLs

  uploadDoc(event: Event, index: number) {
    try {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files[0]) {
        const file = inputElement.files[0];

        // Check if the file has a valid extension and size
        let isValidExtension = this.$common.checkForValidFile(event, false, true, false);
        if (!isValidExtension) {
          this.fileControls[index].fileUrl = '';
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        // Call service to upload the file
        this.$miscellaneousService.documents(formData).subscribe(
          (response: any) => {
            if (response) {
              this.fileUrl = `uploaded_files/${response?.url}`;
            }
          },
          err => {
            console.log('File upload error:', err);
          }
        );
      }
    } catch (error) {
      console.log('Error during file upload:', error);
    }
  }



  // viewImg() {

  //   window.open(this.baseUrl + '/' + this.fileUrl, '_blank');
  // }
  viewImg(index: number) {
    if (this.fileControls[index] && this.fileControls[index].fileUrl) {
      window.open(this.baseUrl + '/' + this.fileControls[index].fileUrl, '_blank');
    } else {
      console.log('No file URL available for the selected index.');
    }
  }

  // Form submit start
  handleSubmit() {
    try {
      let value = this.bgvMailForm?.value;
      let selectedEntityId = localStorage.getItem("selectedEntityId");
      if (!value?.candidate_description || !value?.company_details[0].company_email) {
        return this.toastr.error('Required fields should not be empty', 'Fields Error');
      }
      let data = {
        ...this.bgvMailForm?.value,
        candidate_document: this.fileUrl,
        candidate_id: this.candidate_id,
        email_url: this.baseHref + 'company-remarks',
        entityId: selectedEntityId,
      };
      this.$bgv.create_company_details(data).subscribe((response: any) => {
        if (response) {
          // try {
          //   navigator.clipboard.writeText(response.email_urlID).then(() => {
          //     this.toastr.success(`link:- ${response.email_urlID} copied successfully`);
          //   }).catch(err => {
          //     console.error('Failed to copy the link:', err);
          //     this.toastr.error('Failed to copy link');
          //   });
          // } catch (err) {
          //   console.error('Clipboard API not supported:', err);
          //   this.toastr.error('Clipboard API not supported');
          // }

          this.toastr.success(response?.message);
          this.goBack();
        }
      }, err => {
        console.log(err);
        this.toastr.error(err?.error?.message);
      })
    } catch (error) {
      console.log(error);
    }
  }

  goBack() {
    this.location.back();
  }


  getStartDate(index: number): Date {
    const company_details = this.bgvMailForm.get('company_details') as FormArray;
    return company_details.at(index)?.get('start_date')?.value;
  }



  fromDate(e: any, i: number) {
    const formArray = this.candidate_id.get('prev_employer_details') as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    const selectedFromDate = e.value;

    if (selectedFromDate) {
      // Set the minimum date for TO DATE to the day after the FROM DATE
      this.minToDate = moment(selectedFromDate).add(1, 'days').toDate();
      // Clear the TO DATE field if it's before the new minimum date
      const toDateControl = formGroup.get('to_date');
      if (toDateControl && toDateControl.value && toDateControl.value < this.minToDate) {
        toDateControl.setValue(null);
      }
    }
  }

  disableFutureDates = (d: Date | null): boolean => {
    const today = new Date();
    // Disable today's date and any future date
    return d ? d < today : false;
  };

  toDate: any;
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
  }

  toDateFilter = (d: Date | null): boolean => {
    return d ? d >= this.minToDate && d <= this.today : false;
  };



  fileControls = [{ fileUrl: '' }];

  addFileControl() {
    this.fileControls.push({ fileUrl: '' });
  }


  removeFileControl(index: number) {
    if (this.fileControls.length > 1) {
      this.fileControls.splice(index, 1);
    }
  }
}