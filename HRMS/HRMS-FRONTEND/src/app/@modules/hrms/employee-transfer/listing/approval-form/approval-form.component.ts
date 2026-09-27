import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
  styleUrls: ['./approval-form.component.scss'],
})
export class ApprovalFormComponent {
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
      ApprovalRemarks: [null, Validators.required],
      role_master_id: [null, Validators.required],
      primary_entity_id: [null, Validators.required],
      employee_id: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.getAllEntityMasterdata();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.mode = params.mode;
    });

    if (this.mode === 'view') {
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
    const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
    this.EmpMainId = localStorage.getItem('EmpMainId');
    if (entityList.length > 0) {
      this.entity_id = entityList[0].entity_id;
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
      this.filteredEmployees = this.entityMasterData.filter(
        (emp: any) => emp.entity_id == this.entity_id
      );
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
          ApprovalRemarks: this.Userdata.ApprovalRemarks,
          role_master_id: this.Userdata.role_master_id,
          primary_entity_id: this.Userdata.primary_entity_id,
          employee_id: this.Userdata.employee_id,
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
  }

  selectApprovalEntityId(selectedEntityId: any) {
    if (!selectedEntityId) {
      this.ApprovalEmployeeFilter = [];
      return;
    }
    this.ApprovalEmployeeFilter = this.entityMasterData.filter(
      (emp: any) => emp.entity_id == selectedEntityId
    );
  }

  employeeApproval() {
    if (!this.id) {
      this.toaster.error('Invalid ID! Update failed.');
      return;
    }
    this.employeeTransfer
      .approvedEmployeetransfer(this.id, this.EmployeeTransferForm.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Data Updated Successfully');
          this.router.navigate([
            '/master/hrms/employee-transfer/pending-for-approval',
          ]);
        },
        (error: any) => {
          console.error('Update Error:', error);
          this.toaster.error('Update failed. Please try again.');
        }
      );
  }

  employeeRejected() {
    if (!this.id) {
      this.toaster.error('Invalid ID! Update failed.');
      return;
    }
    this.employeeTransfer
      .employeeRejected(this.id, this.EmployeeTransferForm.value)
      .subscribe(
        (res: any) => {
          this.toaster.success('Employee Rejected Successfully');
          this.router.navigate([
            '/master/hrms/employee-transfer/pending-for-approval',
          ]);
        },
        (error: any) => {
          console.error('Update Error:', error);
          this.toaster.error('Update failed. Please try again.');
        }
      );
  }

  Backtolist() {
    this.router.navigate([
      '/master/hrms/employee-transfer/pending-for-approval',
    ]);
  }
}
