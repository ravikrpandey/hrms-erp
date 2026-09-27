import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-my-ticket',
  templateUrl: './create-my-ticket.component.html',
  styleUrls: ['./create-my-ticket.component.scss']
})
export class CreateMyTicketComponent {
  myTicketForm: FormGroup;
  departments: any;
  categories: any;
  priorities: string[] = ['Low', 'Medium', 'High', 'Urgent'];
  loginUserDetails: any;
  baseUrl: any;
  id: any
  actionType: any
  allocatedId: any
  created_by: any
  employeList: any;
  roleGetByemployee: any
  ticketData: any
  constructor(private fb: FormBuilder,
    private location: Location,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private _rbacMasterService: RbacMasterService,
    private $helpdeskService: HelpdeskService,
    private $router: Router,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.baseUrl = environment.serverUrl
    this.myTicketForm = this.fb.group({
      formType: ['My Ticket'],
      ticketType: ['self', Validators.required],
      employee_id: [this.loginUserDetails?.employee_id, Validators.required],
      department_id: [null, Validators.required],
      ticket_category_id: [null, Validators.required],
      priority: [null, Validators.required],
      subject: [null, Validators.required],
      description: [null, Validators.required],
      remark: [null],
      status_type: [null],
      documentDetails: this.fb.array([
        this.createFileControl()
      ])
    });
    this.getTicketCategory()
    this.employeData()
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.actionType = params.actionType;
      this.allocatedId = params.allocatedId;
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getticketById()
    }
  }

  getticketById() {
    this.$helpdeskService.getticketById(this.id).subscribe((res: any) => {
      this.ticketData = res.data;
      this.myTicketForm.patchValue({
        formType: res.data.formtype,
        ticketType: res.data.forperson,
        employee_id: res.data.employee_id,
        department_id: res.data.dept_id,
        ticket_category_id: res.data.category_id,
        priority: res.data.priority,
        subject: res.data.subject,
        description: res.data.description,
        status_type: res.data.status_type,
        remark: res.data.remark,
      })
      this.onDepartmentChange(res.data.dept_id);
      if (res.data.ESS_MY_TICKET_DOCUMENTs?.length) {
        this.documentDetails.clear(); // Clear existing controls
        res.data.ESS_MY_TICKET_DOCUMENTs.forEach((doc: any) => {
          this.documentDetails.push(this.fb.group({
            document_path: [doc.filename]
          }));
        });
      }
    })
  }

  createFileControl() {
    return this.fb.group({
      document_path: ['']
    });
  }
  get documentDetails() {
    return this.myTicketForm.get('documentDetails') as FormArray;
  }

  addFileControl() {
    this.documentDetails.push(this.fb.group({
      document_path: ['']
    }));
  }
  openImage(imageUrl: string) {
    if (imageUrl) {
      window.open(`${this.baseUrl}${imageUrl}`, '_blank'); // Opens the image in a new tab
    } else {
      console.error("No image URL provided");
    }
  }
  removeFileControl(index: number) {
    this.documentDetails.removeAt(index);
  }
  uploadedFileUrls: string[] = []
  uploadDoc(event: Event, index: number) {
    try {
      const inputElement = event.target as HTMLInputElement;
      if (!inputElement.files || inputElement.files.length === 0) {
        return;
      }

      const file = inputElement.files[0];

      const isValidExtension = this.$common.checkForValidFile(event, false, true, false);
      if (!isValidExtension) {
        this.documentDetails.at(index).patchValue({ document_path: '' });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response?.url) {
            const filePath = `uploaded_files/${response.url}`;


            this.documentDetails.at(index).patchValue({ document_path: filePath });


            this.uploadedFileUrls.push(filePath);
            console.log('Uploaded file URLs:', this.uploadedFileUrls);
          }
        },
        (err) => {
          console.error('File upload error:', err);
        }
      );
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  }
  data: any
  getTicketCategory() {
  this.$helpdeskService.getAllticketcategorydata().subscribe((res: any) => {
    if (res?.data) {
      // Full data save
      this.data = res.data;

      // Departments unique by dept_id
      const allDepartments = res.data.map((item: any) => item.MASTER_DEPARTMENT || {
        dept_id: item.dept_id,
        department_name: item.department_name
      });

      this.departments = allDepartments.filter(
        (dept: { dept_id: any; }, index: any, self: any[]) =>
          index === self.findIndex(d => d.dept_id === dept.dept_id)
      );

      console.log(this.departments);
    }
  }, (error) => {
    console.error("Error fetching ticket categories:", error);
  });
}

  onDepartmentChange(event: any) {
    console.log(event)
    const selectedDeptId = event;

    this.setCategoriesForDepartment(selectedDeptId);
  }
  setCategoriesForDepartment(departmentId: number) {
    console.log(this.data)
    const filteredCategories = this.data.filter((item: any) => item.MASTER_DEPARTMENT.dept_id === departmentId);
    console.log(filteredCategories)

    this.categories = filteredCategories;
    console.log('Filtered categories for department:', this.categories);


  }
  employeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this.$helpdeskService.employeList(entity_id).subscribe((res: any) => {
      this.employeList = res.data;
    })
  }
  onSubmit() {
    if (this.id) {
      let payload = {
        ...this.myTicketForm.value,
        created_by: this.loginUserDetails?.employee_id
      }
      if (this.myTicketForm.value === "self") {
        payload = {
          ...this.myTicketForm.value,
          created_by: this.loginUserDetails?.employee_id
        }
      }
      this.$helpdeskService.updateTicket(this.id, payload).subscribe((res: any) => {

        console.log('Ticket created successfully:', res);
        if (res.status === 'success') {
          this.toaster.success("success");
          this.$router.navigate(['/master/ess/my-tickets']);
        }
      })
    } else {
      if (this.myTicketForm.valid) {
        let payload = {
          ...this.myTicketForm.value,
          created_by: this.loginUserDetails?.employee_id
        }
        if (this.myTicketForm.value === "self") {
          payload = {
            ...this.myTicketForm.value,
            created_by: this.loginUserDetails?.employee_id
          }
        }
        this.$helpdeskService.createTicket(payload).subscribe((res: any) => {

          console.log('Ticket created successfully:', res);
          if (res.status === 'success') {
            this.toaster.success("success");
            this.$router.navigate(['/master/ess/my-tickets']);
          }
        })

      }
    }
  }

  handleTicketFor() {
    let formValue = this.myTicketForm?.value;
    if (formValue?.ticketType == 'self') {
      this.myTicketForm.patchValue({ employee_id: this.loginUserDetails.employee_id })
    }
  }

  chnageStatus() {
    let value = this.myTicketForm.value;
    let req = {
      status_type: value?.status_type,
      remark: value?.remark,
      ticket_id: this.id,
      allocate_id: this.allocatedId,
    }
    this.$helpdeskService.update_ticket_status(req).subscribe((res: any) => {
      if (res) {
        this.toaster.success(res.message);
        this.goBack()
      }
    })
  }

  goBack() {
    this.location.back();
  }

}
