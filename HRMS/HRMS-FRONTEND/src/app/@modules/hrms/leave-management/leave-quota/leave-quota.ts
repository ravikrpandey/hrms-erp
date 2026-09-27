import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';

interface LeaveOption {
  leave_id: any;
  leave_name: string;
  leave_code?: string;
}

interface LeaveData {
  selectedLeave: LeaveOption | null;
  leave_id: any;
  leave_name: string;
  leave_code: string;
  no_of_days: number | string;
  available_days: number | string;
}

@Component({
  selector: 'app-leave-quota',
  templateUrl: './leave-quota.html',
  styleUrls: ['./leave-quota.scss']
})
export class LeaveQuota implements OnInit {

  selectedEmployee: number | null = null;
  employees: any[] = [];
  filteredEmployees: any[] = [];

  leaveData: MatTableDataSource<LeaveData> = new MatTableDataSource<LeaveData>([]);

  leaveOptions: LeaveOption[] = [];

  entity_id!: number;

  displayedColumns = [
    'sno',
    'leave_name',
    'leave_code',
    'no_of_days',
    'available_days',
    'actions'
  ];

  constructor(
    private employeeService: EmpRegistrationService,
    private leaveService: LeaveApplyService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));
    this.getEmployees();
    this.getAllLeave();
  }

  getEmployees() {
    this.employeeService.getemployeeListData(this.entity_id).subscribe({
      next: (res: any) => {
        this.employees = res.data || [];
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => console.error('Error fetching employees', err)
    });
  }

  onEmployeeFilter(filteredData: any[]) {
    this.filteredEmployees = filteredData;
  }

  onEmployeeSelect(event: any) {
    this.selectedEmployee = event.value;
    if (this.selectedEmployee) {
      this.getAllLeaveQuota(this.selectedEmployee);
    }
  }

// getAllLeaveQuota(employee_id: number) {
//   this.leaveService.getAllLeaveQuota(employee_id).subscribe({
//     next: (res: any) => {
//       const data: LeaveData[] = res?.data || [];

//       // Map selectedLeave object
//       data.forEach(row => {
//         row.selectedLeave = this.leaveOptions.find(l => l.leave_id === row.leave_id) || null;
//       });

//       this.leaveData.data = data;
//       this.leaveData._updateChangeSubscription();
//     },
//     error: (err) => {
//       console.error('Error fetching leave quota:', err);
//       this.leaveData.data = [];
//       this.leaveData._updateChangeSubscription();
//     }
//   });
// }


getAllLeaveQuota(employee_id: number) {
  this.leaveService.getAllLeaveQuota(employee_id).subscribe({
    next: (res: any) => {
      let data: LeaveData[] = res?.data || [];

      // Agar data empty hai to ek blank row add karo
      if (data.length === 0) {
        data.push({
          leave_id: null,
          leave_name: '',
          leave_code: '',
          no_of_days: 0,
          available_days: 0,
          selectedLeave: null
        });
      }

      this.leaveData.data = data;
      this.leaveData._updateChangeSubscription(); // refresh table
    },
    error: (err) => {
      console.error('Error fetching leave quota:', err);

      // Error hone par bhi ek blank row dikhaye
      this.leaveData.data = [{
        leave_id: null,
        leave_name: '',
        leave_code: '',
        no_of_days: 0,
        available_days: 0,
        selectedLeave: null
      }];
      this.leaveData._updateChangeSubscription();
    }
  });
}


  getAllLeave() {
  this.leaveService.getAllLeave(this.entity_id).subscribe({
    next: (res: any) => {
      if (res?.data) {
        this.leaveOptions = res.data.map((item: any) => ({
          leave_id: item.id, 
          leave_name: item.leave_name?.trim(), 
          leave_code: item.leave_code
        }));

        console.log('✅ leaveOptions:', this.leaveOptions);
      }
    },
    error: (err) => console.error('Error fetching leave types:', err)
  });
}


isLeaveSelected(leave: LeaveOption, currentRow: LeaveData): boolean {
  return this.leaveData.data.some(row => 
    row.leave_id === leave.leave_id && row !== currentRow
  );
}


  addLeave() {
    const newRow: LeaveData = {
      leave_id: null,
      leave_name: '',
      leave_code: '',
      no_of_days: 0,
      available_days: 0,
      selectedLeave: null
    };

    const data = this.leaveData.data;
    data.push(newRow);
    this.leaveData.data = [...data]; 
    this.leaveData._updateChangeSubscription(); 
  }

  deleteLeave(index: number) {
    const data = this.leaveData.data;
    data.splice(index, 1);
    this.leaveData.data = [...data];
    this.leaveData._updateChangeSubscription();
  }



onLeaveNameChange(row: LeaveData) {
  const selectedLeave = this.leaveOptions.find(l => l.leave_id === row.leave_id);
  if (selectedLeave) {
    row.leave_name = selectedLeave.leave_name;
    row.leave_code = selectedLeave.leave_code || '';
  } else {
    row.leave_name = '';
    row.leave_code = '';
  }
}





submit() {
  if (!this.leaveData || !this.leaveData.data || this.leaveData.data.length === 0) {
    this.toastr.warning('Please add at least one leave row before submitting.');
    return;
  }

  
  const validLeaveData = this.leaveData.data
    .filter(row => row.no_of_days != null) 
    .map(row => ({
      leave_id: row.leave_id,          
      no_of_days: row.no_of_days,
      available_days: row.available_days || 0
    }));

  if (validLeaveData.length === 0) {
    this.toastr.warning('Please fill at least one leave with no_of_days.');
    return;
  }

  const payload = { leaveData: validLeaveData };

  console.log('Submitting leave data:', JSON.stringify(payload, null, 2));

  this.leaveService.updateLeaveQuota(this.selectedEmployee, payload).subscribe({
    next: (res: any) => {
      if (res) {
        this.toastr.success(res.message);
        console.log('Response data:', res.data);
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    },
    error: (err) => {
      console.error('Error submitting leave data:', err);
      this.toastr.error('Failed to submit leave data');
    }
  });
}
}
