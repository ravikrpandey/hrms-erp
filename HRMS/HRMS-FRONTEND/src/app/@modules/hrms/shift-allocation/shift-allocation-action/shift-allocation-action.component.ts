import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';

@Component({
  selector: 'app-shift-allocation-action',
  templateUrl: './shift-allocation-action.component.html',
  styleUrls: ['./shift-allocation-action.component.scss'],
})
export class ShiftAllocationActionComponent {


  params: any;
  selectedType: any;
  dept_id: any;
  IsStatus: any;
 shift_id:any 
  
  constructor(
    private router: Router,
    private shiftAllocatedservices: ShiftAllocationService,
    private toster: ToastrService
  ) {}

 
  agInit(params: any): void {
    this.params = params;
    this.dept_id = params.data.dept_id;
    this.shift_id = params.data.shift_master_id
    this.IsStatus = params.data.IsStatus;
  }

  ngOnInit() {
    // console.log('Action Params:', this.params.data);
  }

  viewDetails() {
    this.router.navigate(['/master/hrms/shift-allocation/add'], {
      queryParams: { type: this.selectedType, mode: 'view', id: this.dept_id , shift_id : this.shift_id },
    });
  }

  editItem() {
    this.router.navigate(['/master/hrms/shift-allocation/add'], {
      queryParams: { type: this.selectedType, mode: 'edit', id: this.dept_id , shift_id : this.shift_id },
    });
  }

  deleteItem() {
    if (!this.dept_id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }
    if (confirm('Are you sure you want to delete this record?')) {
      this.shiftAllocatedservices.DeleteShiftAllocationRecord(this.dept_id).subscribe(
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
