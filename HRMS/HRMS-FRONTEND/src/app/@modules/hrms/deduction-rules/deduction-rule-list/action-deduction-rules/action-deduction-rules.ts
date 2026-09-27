import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';
@Component({
  selector: 'app-action-deduction-rules',
  templateUrl: './action-deduction-rules.html',
  styleUrls: ['./action-deduction-rules.scss'],
})
export class ActionDeductionRules {
  params: any;
  selectedType: any;
  dept_id: any;
  IsStatus: any;
 shift_id:any 
  
  constructor(
    private router: Router,
    private hrmsService: HrServiceService,
    private toster: ToastrService,
        private route: Router,
  ) {}

 currentUrl:any
  agInit(params: any): void {
    this.params = params.data;
    console.log(params)
    this.dept_id = params.data.id;
    this.shift_id = params.data.shift_id
    this.IsStatus = params.data.status;
  }

  ngOnInit() {
 this.currentUrl = this.router.url;
  console.log('Current URL:', this.currentUrl);
  }

viewDetails() {
    if (!this.dept_id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }
    this.router.navigate(['/master/hrms/deduction-rules-form'], {
      queryParams: { type: this.selectedType, mode: 'view', id: this.dept_id, shift_id: this.shift_id },
    });
  }

viewDetailsAttendance() {
  if (!this.params.emp_id || !this.params.entity_id) {
    this.toster.error('Invalid Request: Missing employee or entity details!');
    return;
  }

  this.router.navigate(['/master/hrms/view-attendance-working-hours'], {
    queryParams: {
      emp_id: this.params.emp_id,
      month: this.params.month,
      year: this.params.year,
      entity_id: this.params.entity_id,
      shift_id: this.params.shift_id
    },
  });
}

  editItem() {
    if (!this.dept_id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }
    this.router.navigate(['/master/hrms/deduction-rules-form'], {
      queryParams: { type: this.selectedType, mode: 'edit', id: this.dept_id, shift_id: this.shift_id },
    });
  }

  deleteItem() {
    if (!this.dept_id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }


    const payload = { status: this.IsStatus }

    this.hrmsService.deletedeductionRule(this.dept_id).subscribe({
      next: (res: any) => {
        this.toster.success('Record deleted successfully');
       this.reloadCurrentRoute()
      },
      error: (err) => {
        console.error('Error deleting record:', err);
        this.toster.error('Server error: Unable to delete record');
      }
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  
}

