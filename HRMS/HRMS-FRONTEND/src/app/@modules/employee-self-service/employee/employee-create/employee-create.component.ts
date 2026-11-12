import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { environment } from 'src/app/environments/environment';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent {

  active: boolean = false;
  id: any;
  employeId: any;
  data: any;
  urll: any;
  urll2: any
  title: string = 'BASIC-DETAILS'
  mode: any;
  edited_ID: any;
  loginUserDetails: any;
  baseUrl: any;
  imagePath: any = 'assets//icons/icon_kiran/employee.png'
  thumbnail_photo: any

  uploadSuccess: boolean = false;

  constructor(private location: Location, private $miscellaneousService: MiscellaneousService,private activeroute: ActivatedRoute, private route: Router, private _empRegistration: EmpRegistrationService,) {
    this.baseUrl = environment.serverUrl;
  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)

    console.log('Base URL:', this.baseUrl);
    console.log('Login User Image Path:', this.loginUserDetails?.employee_photo);

    this._empRegistration.getEmpId().subscribe(
      (res: any) => {
        this.edited_ID = res
      })

    this._empRegistration.getEmpTitle().subscribe(
      (res: any) => {
        this.title = res
      })

    this.activeroute.queryParams.subscribe(params => {
      this.id = params;
      this.employeId = this.id.employee_id
      this.mode = this.id.mode
    })
    if (this.employeId) {
      this.active = true;
      this.edited_ID = this.employeId

    }
    if (!this.employeId) {
      this.urll = this.route.url;
      this.urll2 = this.route.url.toString();
      this.data = (this.urll2.slice(45, 60)).toUpperCase()
    } else {
      this.urll = this.route.url;
      this.urll2 = this.route.url.toString();
      this.data = (this.urll2.slice(45, 58)).toUpperCase()
    }

  }

  url(elite: any) {
    this.data = elite

  }



  goToBasicDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/basic-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };

  goToPersonalDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/personal-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };

  goToSalaryDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/salary-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };

  goToPaymentDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/payment-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };

  goToDocumentDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/document-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };

  goToContractDetails(title: string) {
    this.title = title
    this.route.navigate(['master/ess/employ/employee-create/contract-details'], { queryParams: { employee_id: this.edited_ID, mode: this.mode } })
  };


  goBack() {
    this.location.back();
  }

uploadImage(event: Event): void {
  try {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Step 1: Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnail_photo = reader.result as string;
        this.uploadSuccess = true;

        setTimeout(() => {
          this.uploadSuccess = false;
        }, 3000);
      };
      reader.readAsDataURL(file);

      // Step 2: Upload image to /documents
      const formData = new FormData();
      formData.append('file', file);

      this.$miscellaneousService.documents(formData).subscribe(
        (uploadRes: any) => {
          if (uploadRes?.url) {
            const uploadedPath = `uploaded_files/${uploadRes.url}`;

            // Step 3: Update employee basic details
            const payload = {
              employee_id: this.edited_ID,
              employee_photo: uploadedPath
            };

            this._empRegistration.updateBasicDetails(this.edited_ID, payload).subscribe(
              (res: any) => {
                this.thumbnail_photo = this.baseUrl + '/' + uploadedPath;

                // Optional: Update local storage
                const userDetails = JSON.parse(localStorage.getItem('loginUserDetails') || '{}');
                userDetails.employee_photo = uploadedPath;
                localStorage.setItem('loginUserDetails', JSON.stringify(userDetails));
              },
              (err) => {
                console.error('Error updating employee details:', err);
              }
            );
          }
        },
        (err) => {
          console.error('Error uploading document:', err);
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}



  viewImage(imagePath: string): void {
    const isFullUrl = imagePath?.startsWith('http') || imagePath?.startsWith('data:');
    const imageUrl = isFullUrl ? imagePath : `${this.baseUrl}/${imagePath}`;
    window.open(imageUrl, '_blank');
  }


}
