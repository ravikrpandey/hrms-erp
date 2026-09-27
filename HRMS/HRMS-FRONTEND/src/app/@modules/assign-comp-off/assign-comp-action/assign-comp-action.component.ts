import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';
import { CompOffDialogComponent } from '../comp-off-dialog/comp-off-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-comp-action',
  templateUrl: './assign-comp-action.component.html',
  styleUrls: ['./assign-comp-action.component.scss'],
})
export class AssignCompActionComponent {
  params: any;
  selectedType: any;
  id: any;
  IsStatus: any;
  @Output() viewClicked = new EventEmitter<any>();
  entity_id: any;
  from_date: any;
  to_date: any;
  employee_id: any;
  constructor(
    private router: Router,
    private toster: ToastrService,
    private comservice: CompServiceService,
    private dialog: MatDialog
  ) {}

  agInit(params: any): void {
    this.params = params;
    this.id = params.data.id;
    this.IsStatus = params.data.IsStatus;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.from_date = params.data.from_date;
    this.to_date = params.data.to_date;
    this.employee_id = params.data.employee_id;
  }

  viewDetails() {
    if (this.params.onViewClicked) {
      this.params.onViewClicked(this.params.data);
    }
    this.getAllInOutAttendanceData();
  }

  editItem() {
    this.router.navigate(['/master/comp-off/add'], {
      queryParams: {
        type: this.selectedType,
        mode: 'edit',
        id: this.id,
      },
    });
  }

  deleteItem() {
    if (!this.id) {
      this.toster.error('Invalid Request: ID not found!');
      return;
    }
    if (confirm('Are you sure you want to delete this record?')) {
      this.comservice.deleteCompOff(this.id).subscribe(
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

 getAllInOutAttendanceData() {
  this.comservice
    .getCompOffInOut(
      this.from_date,
      this.to_date,
      this.entity_id,
      this.employee_id
    )
    .subscribe(
      (res: any) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          this.dialog.open(CompOffDialogComponent, {
            width: '800px',
            data: res.data,
          });
        } else {
          this.toster.warning('No data found!');
        }
      },
      (error) => {
        console.error('Error fetching attendance:', error);
        this.toster.error('Server error while fetching attendance');
      }
    );
}

}
