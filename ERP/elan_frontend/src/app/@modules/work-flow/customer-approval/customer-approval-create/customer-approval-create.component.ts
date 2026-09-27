import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-customer-approval-create',
  templateUrl: './customer-approval-create.component.html',
  styleUrls: ['./customer-approval-create.component.scss']
})
export class CustomerApprovalCreateComponent {
  getUserRole: any;
  approvalform: FormGroup;
  getAllEmpData: any[] = [];
  submitted = false;

  // For search filter in mat-select
  employeeFilterCtrl: FormControl = new FormControl();
  filteredEmployees: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  id: any;
  mode: any;
  entity_id: string | null;

  constructor(
    public dialog: MatDialog,
    private toaster: ToastrService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private service: ConfigurationalmasterService,

  ) {
    this.approvalform = this.fb.group({
      employee_ids: [[], Validators.required],
      approval_option: ['with_document', Validators.required]
    });
  }


  ngOnInit(): void {
    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else { }

    this.router.queryParams.subscribe((params: any) => {
      this.id = params['id'];
      this.mode = params['mode'];
      if (this.id) {
        this.getCustomerApprovalById(this.id);
      }
     
    });

    this.entity_id = localStorage.getItem("selectedEntityId");
    this.onApprovalOptionChange('without_document')
  }


getCustomerApprovalById(id: string) {
  this.service.get_customer_approvalById(id).subscribe((response: any) => {
    console.log("fdhhhhhhhhhhhhhhhhhhhhhhh",response)
    if (response && response.data) {
      const approval_option = response.data.approval_option || 'with_document';
      const emp_ids = (response.data.employee_ids || []).map((id: any) => Number(id));

      this.service.getEmployeeListForAll(approval_option).subscribe((res: any) => {
        if (res && res.data) {
          this.getAllEmpData = res.data.map((row: any) => {
            row.full_name = row.first_name + " " + row.last_name + " [" + row.employee_code +"]";
            return row;
          });

          this.filteredEmployees.next(this.getAllEmpData.slice());

          this.approvalform.patchValue({
            approval_option,
            employee_ids: emp_ids
          });
           this.onApprovalOptionChange('without_document');
        }
      });
    }
  });
}






getEmployeeAllList(approval_option: string) {
  this.service.getEmployeeListForAll(approval_option).subscribe((res: any) => {
    if (res && res.data) {
      this.getAllEmpData = res.data.map((row: any) => {
        row.full_name = row.first_name + " " + row.last_name + " [" + row.employee_code +"]";
        return row;
      });

      this.filteredEmployees.next(this.getAllEmpData.slice());
    } else {
      this.getAllEmpData = [];
      this.filteredEmployees.next([]);
    }

    this.employeeFilterCtrl.valueChanges.subscribe(() => {
      this.filterEmployees();
    });
  });
}



onApprovalOptionChange(option: string) {
  this.getEmployeeAllList(option);
}


  filterEmployees() {
    if (!this.getAllEmpData) return;

    let search = this.employeeFilterCtrl.value;
    if (!search) {
      this.filteredEmployees.next(this.getAllEmpData.slice());
      return;
    }

    search = search.toLowerCase();
    this.filteredEmployees.next(
      this.getAllEmpData.filter(emp =>
        emp.full_name.toLowerCase().includes(search)
      )
    );
  }


  goBack() {
    this.location.back();
  }

  onSubmit() {
    this.submitted = true;

    if (this.approvalform.valid) {
      const payload = {
        employee_ids: this.approvalform.value.employee_ids,
        approval_option: this.approvalform.value.approval_option,
      };

      if (this.mode === 'edit' && this.id) {
        this.service.updateCustomerApprovalById(this.id, payload).subscribe({
          next: (res: any) => {
            this.toaster.success('Customer Approval updated successfully');
            this.location.back();
          },
          error: (err: any) => {
            console.error("Error in update:", err);
            this.toaster.error('Something went wrong while updating');
          }
        });
      } else {
        this.service.saveCustomerApproval(payload).subscribe({
          next: (res: any) => {
            this.toaster.success('Customer Approval created successfully');
            this.location.back();
          },
          error: (err: any) => {
            console.error("Error in submission:", err);
            this.toaster.error('Something went wrong while creating');
          }
        });
      }

    } else {
      this.toaster.error('Please fill all required fields');
    }
  }


}
