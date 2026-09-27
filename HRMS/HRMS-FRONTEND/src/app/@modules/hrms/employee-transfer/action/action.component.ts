import { P } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  params: any;
  selectedType: any;
  id: any;
  constructor(
    private router: Router,
    private employeeTransfer: EmployeeTransferService,
    private toster: ToastrService
  ) {}

  IsStatus: any;
  agInit(params: any): void {
    this.params = params;
    this.id = params.data.id;
    this.IsStatus = params.data.IsStatus;
  }

  ngOnInit() {
    console.log('Action Params:', this.params.data);
  }

  viewDetails() {
    this.router.navigate(['/master/hrms/employee-transfer/transfer'], {
      queryParams: { type: this.selectedType, mode: 'view', id: this.id },
    });
  }

  editItem() {
    this.router.navigate(['/master/hrms/employee-transfer/transfer'], {
      queryParams: { type: this.selectedType, mode: 'edit', id: this.id },
    });
  }

  deleteItem() {
    if (!this.id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }

    if (confirm('Are you sure you want to delete this record?')) {
      this.employeeTransfer.DeleettheEmployeeTransferdata(this.id).subscribe(
        (res: any) => {
          this.toster.success('Record deleted successfully');
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting record:', error);
          this.toster.error('Server error: Unable to delete record');
        }
      );
    }
  }
}
