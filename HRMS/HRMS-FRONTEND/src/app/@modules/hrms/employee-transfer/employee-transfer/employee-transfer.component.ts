import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrls: ['./employee-transfer.component.scss'],
})
export class EmployeeTransferComponent implements OnInit {
  EmployeeTransferForm: FormGroup;
  entity_id: any;
  EmpMainId: any;
  entityMasterData: any = [];
  filteredEmployees: any = [];
  ApprovalEmployeeFilter: any = [];
  id: any;
  Userdata: any;
  mode: any;
  entity: any = [];
  isDisabledSkill: true;
  filtertoentity: any;
  loginId: any;
  filterEntity_id: any;
  filteremployees: any;
  filterApprovalentity_id: any;
  filterApprovalemployeesdata: any;
  fromEntity: any;
  filterApprovalentity_iddata: any;

  constructor(
    private router: Router,
    private employeeTransfer: EmployeeTransferService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.EmployeeTransferForm = this.fb.group({
      fromEntityId: [null, Validators.required],
      fromEmpId: [null, Validators.required],
      toEntityId: [null, Validators.required],
      toRemark: [null, Validators.required],
      approvalEntityId: [null, Validators.required],
      approvalEmpId: [null, Validators.required],
      createdBy: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllEntityMasterdata();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
    });
    if (this.mode === 'view') {
      // this.EmployeeTransferForm.get('fromEntityId')?.disable();
    }
  }

  getAllEntityMasterdata() {
    this.employeeTransfer.getAllEntityMasterdata().subscribe(
      (res: any) => {
        this.entityMasterData = res.data;
        console.log('Entity Master Data:', this.entityMasterData);
        this.selectFromentityid();
      },
      (error) => {
        console.error('Error fetching entity master data:', error);
      }
    );
  }

  selectFromentityid() {
    const entity = localStorage.getItem('selectedEntityId');
    this.EmpMainId = localStorage.getItem('EmpMainId');
    if (entity) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.entity = this.entityMasterData.reduce(
        (acc: any[], item: { entity_id: any }) => {
          if (!acc.some((e: any) => e.entity_id === item.entity_id)) {
            acc.push(item);
          }
          return acc;
        },
        []
      );
      this.filterEntity_id = [...this.entity];
      this.fromEntity = [...this.entity];
      this.filtertoentity = [...this.entity];
      this.filterApprovalentity_id = [...this.entity];
      this.filterApprovalentity_iddata = [...this.entity];
      this.filteredEmployees = this.entityMasterData.filter(
        (emp: any) => emp.entity_id == this.entity_id
      );
      this.filteremployees = [...this.filteredEmployees];
      let id = parseInt(this.id);
      this.employeeTransfer.getSingledata(id).subscribe((res: any) => {
        this.Userdata = res.data;
        this.EmployeeTransferForm.patchValue({
          fromEntityId: this.Userdata.fromEntityId,
          fromEmpId: this.Userdata.fromEmpId,
          toEntityId: this.Userdata.toEntityId,
          toRemark: this.Userdata.toRemark,
          approvalEmpId: this.Userdata.approvalEmpId,
          approvalEntityId: this.Userdata.approvalEntityId,
        });
        this.onEntityChange(this.Userdata.fromEntityId);
        this.selectApprovalEntityId(this.Userdata.approvalEntityId);
      });
      this.EmployeeTransferForm.patchValue({
        fromEntityId: parseInt(this.entity_id),
        fromEmpId: parseFloat(this.EmpMainId),
      });
    }
  }

  onEntityChange(selectedEntityId: any) {
    if (!selectedEntityId) {
      this.filteredEmployees = [];
      return;
    }
    this.filteredEmployees = this.entityMasterData.filter(
      (emp: any) => emp.entity_id == selectedEntityId
    );
    this.filteremployees = this.filteredEmployees;
    console.log('old enitity id selected ', selectedEntityId);
  }

  selectApprovalEntityId(selectedEntityId: any) {
    if (!selectedEntityId) {
      this.ApprovalEmployeeFilter = [];
      return;
    }
    this.ApprovalEmployeeFilter = this.entityMasterData.filter(
      (emp: any) => emp.entity_id == selectedEntityId
    );
    this.filterApprovalemployeesdata = this.ApprovalEmployeeFilter;
  }

  Onsubmit() {
    let loginId = localStorage.getItem('EmpMainId');
    if (loginId) {
      this.loginId = parseInt(loginId);
      this.EmployeeTransferForm.get('createdBy')?.setValue(this.loginId);
    } else {
      console.error('loginId is not available in localStorage');
    }
    this.employeeTransfer
      .SavedataEmployeeTransfer(this.EmployeeTransferForm.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Data Saved Sucessfully');
          this.router.navigate(['/master/hrms/employee-transfer/my-Request']);
        },
        (err: any) => {
          this.toaster.error('Error Saved data');
        }
      );
  }

  OnUpdate() {
    if (!this.id) {
      this.toaster.error('Invalid ID! Update failed.');
      return;
    }
    this.employeeTransfer
      .UpdateEmployeeTransferData(this.id, this.EmployeeTransferForm.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Data Updated Successfully');
          this.router.navigate(['/master/hrms/employee-transfer/my-Request']);
        },
        (error: any) => {
          console.error('Update Error:', error);
          this.toaster.error('Update failed. Please try again.');
        }
      );
  }

  Backtolist() {
    this.router.navigate(['/master/hrms/employee-transfer/my-Request']);
  }
}
