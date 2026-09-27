import { Component, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AssignUserService } from 'src/app/@shared/services/crm/assign-user.service';

@Component({
  selector: 'app-assign-user-create',
  templateUrl: './assign-user-create.component.html',
  styleUrls: ['./assign-user-create.component.scss'],
})
export class AssignUserCreateComponent implements OnInit {
  private gridApi!: GridApi<any>;
  candidate_id?: number;
  rowData: any = [];
  assignAction: any;
  rowClass: any;
  matBtnColor: boolean = true;
  assignUserForm: FormGroup;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedLeadList: any = [];
  selectedEmployeeList = new FormControl('');
  loading: boolean = false;
  assignedUserId: any;
  action_type: any;
  isDisabled: boolean = false;
  userLoginId: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _rbackService: RbacMasterService,
    private $crm: CrmService,
    private $assignUser: AssignUserService,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
    this.assignUserForm = this.fb.group({
      branch_id: new FormControl(null, [Validators.required]),
      role_id: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.assignedUserId = params?.id;
      this.action_type = params?.action_type;
      if (this.action_type == 'View') {
        this.isDisabled = true;
      }
      if (this.assignedUserId) {
        this.getSingle();
      }
    });
    this.userLoginId = localStorage.getItem('EmpMainId')
    if (this.userLoginId) {
      this.getBranch();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Employee Name',
      field: 'first_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'User Name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  goBack() {
    this.location.back()
  }

  // Get single start
  singleData: any;
  getSingle() {
    try {
      this.$assignUser.getAssignUserListById(this.assignedUserId).subscribe((response: any) => {
        if (response) {

          this.rowData = response?.data;
          this.singleData = {
            branch_id: this.rowData[0]?.branch_id,
            role_id: this.rowData[0]?.role_id,
            employee_id: this.rowData[0]?.employee_id,
          }
          this.assignUserForm.patchValue({
            branch_id: this.singleData?.branch_id,
            role_id: this.singleData?.role_id,
            employee_id: this.singleData?.employee_id,
          });
          this.changeBranch(false);
          this.getEmployee(false);
          let list: any = [];
          this.rowData?.map((item: any) => {
            list.push(item?.assign_id);
          })
          this.selectedEmployeeList = new FormControl(list);
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  // Get branch start
  branchList: any = [];
  getBranch() {
    try {
      this.$crm.branchSetup_get().subscribe((response: any) => {
        if (response) {
          this.branchList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  changeBranch(remove: any) {
    if (remove) {
      this.roleList = [];
      this.employeeList = [];
      this.allEmployeeList = [];
      this.selectedEmployeeList = new FormControl('');
      this.rowData = [];

      this.assignUserForm.patchValue({
        role_id: '',
        employee_id: '',
      });
    }

    this.getAllEmployee(remove);
    this.getRole(remove);
  }

  // Get role start
  roleList: any = [];
  getRole(remove: any) {
    try {
      this.$crm.getByBranchIdroleMaster(this.assignUserForm?.value?.branch_id).subscribe((response: any) => {
        if (response) {
          this.roleList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  // Get employee start
  employeeList: any = [];
  getEmployee(remove: any) {
    try {
      if (remove) {
        this.employeeList = [];
        this.assignUserForm.patchValue({
          employee_id: '',
        });
      }
      let data = {
        branch_id: this.assignUserForm?.value?.branch_id,
        role_master_id: this.assignUserForm?.value?.role_id,
      }
      this.$assignUser.getEmployeeByRollId(data).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get employee end

  // employeeSelect start
  employeeSelection: boolean = false;
  selectEmployee() {
    this.employeeSelection = true;
    this.getAllEmployee(null);
  }

  // Get all employee start
  allEmployeeList: any = [];
  getAllEmployee(remove: any) {
    try {
      this.$assignUser.getEmployeeListOfBranchId(this.assignUserForm?.value?.branch_id).subscribe((response: any) => {
        if (response) {
          this.allEmployeeList = response.data;

          if (this.employeeSelection) {
            let list = this.allEmployeeList?.filter((elem: any) => elem?.employee_id !== this.assignUserForm?.value?.employee_id);
            this.allEmployeeList = list;
            this.selectedEmployeeList = new FormControl('');
            this.rowData = [];
          }
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all employee end

  selectedEmployee() {
    this.rowData = [];
    let list: any = [];
    let tempSelectedEmployee: any = this.selectedEmployeeList?.value;
    this.allEmployeeList?.map((mainItem: any) => {
      tempSelectedEmployee?.map((childItem: any) => {
        if (mainItem?.employee_id == childItem) {
          list.push(mainItem);
        }
      })
    })
    if (list?.length) {
      this.rowData = list;
    }

    console.log(this.rowData)
  }

  // Form save and update start
  saveForm() {
    if (this.assignUserForm?.status === 'INVALID' || !this.selectedEmployeeList?.value?.length) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    let list: any = this.selectedEmployeeList?.value;
    let readySelectedList: any = [];
    list?.map((item: any) => {
      readySelectedList?.push({ assign_id: item });
    })
    let req = {
      ...this.assignUserForm.value,
      assigned_employee_list: readySelectedList,
      login_id: this.userLoginId,
    };

    if (this.assignedUserId) {
      this.updateForm(req);
    }
    else {
      this.submitForm(req);
    }
  }

  submitForm(req: any) {
    try {
      req.login_id = this.userLoginId;
      this.$assignUser.createAssignUser(req).subscribe((response: any) => {
        if (response) {
          this.toast.success('Assign User Created successfully..');
          this.goBack();
        }
      }, err => {
        this.toast.error(err?.error?.message);
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  updateForm(req: any) {
    try {
      this.$assignUser.patchAssignUserListById(req, this.assignedUserId).subscribe((response: any) => {
        if (response) {
          this.toast.success('Assign User Updated successfully..');
          this.goBack();
        }
      }, err => {
        this.toast.error(err?.error?.message);
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form save and update end

}
