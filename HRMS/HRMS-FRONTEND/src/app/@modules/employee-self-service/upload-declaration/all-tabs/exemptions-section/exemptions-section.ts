import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-exemptions-section',
  templateUrl: './exemptions-section.html',
  styleUrls: ['./exemptions-section.scss']
})
export class ExemptionsSection {
  rentForm!: FormGroup;
  employee_id: any;
  loading: boolean = false;
  accordionOpen: boolean[] = [];
  baseUrl: string;
  Type: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private PayrollService: PayrollService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService
  ) {
    this.baseUrl = environment.serverUrl;
  }

  ngOnInit(): void {
    this.employee_id = JSON.parse(localStorage.getItem('loginUserDetails') || '{}')?.employee_id || null;
    this.rentForm = this.fb.group({
      houses: this.fb.array([])
    });
    this.addHouse();
    this.getHousesOnRent();
  }

  get houses(): FormArray {
    return this.rentForm.get('houses') as FormArray;
  }

  addHouse() {
    const houseGroup = this.createHouseGroup();
    this.houses.push(houseGroup);
    this.accordionOpen.push(false);
  }

  deleteHouse(index: number) {
    this.houses.removeAt(index);
    this.accordionOpen.splice(index, 1);
  }

  getHousesOnRent() {
    this.loading = true;
    this.PayrollService.getHousesOnRent(this.employee_id).subscribe({
      next: (res: any) => {
        this.houses.clear();
        this.accordionOpen = [];
        if (res.code === 200 && res.data?.length > 0) {
          res.data.forEach((house: any) => {
            const houseGroup = this.createHouseGroup(house);
            this.houses.push(houseGroup);
            this.accordionOpen.push(true);
          });
        } else {
          this.addHouse();
        }
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Server error. Please try again later.');
        this.loading = false;
      }
    });
  }

  private createHouseGroup(house: any = {}): FormGroup {
    const houseGroup = this.fb.group({
      id: [house.id || null],
      fromDate: [house.fromDate || null, Validators.required],
      toDate: [house.toDate || null, Validators.required],
      monthlyRate: [house.monthlyRate || 0, Validators.required],
      annualRate: [house.annualRate || 0],
      addressType: [house.addressType || null, Validators.required],
      houseNo: [house.houseNo || null],
      street: [house.street || null],
      city: [house.city || null],
      pincode: [house.pincode || null],
      hasPan: [house.hasPan || 'no'],
      landlordName: [house.landlordName || null],
      landlordAddress: [house.landlordAddress || null],
      landlordHouseNo: [house.landlordHouseNo || null],
      landlordStreet: [house.landlordStreet || null],
      landlordCity: [house.landlordCity || null],
      panNumber: [house.panNumber || null],
      document: [house.document || null]
    });

    
    houseGroup.get('monthlyRate')?.valueChanges.subscribe((monthly: any) => {
      const monthlyNum = Number(monthly);
      houseGroup.get('annualRate')?.setValue(isNaN(monthlyNum) ? 0 : monthlyNum * 12, { emitEvent: false });
    });

   
    houseGroup.get('hasPan')?.valueChanges.subscribe((value: any) => {
      const fields = ['landlordName', 'landlordAddress', 'landlordHouseNo', 'landlordStreet', 'landlordCity', 'panNumber'];
      if (value === 'no') {
        fields.forEach(ctrl => houseGroup.get(ctrl)?.reset({ value: '', emitEvent: false }));
        fields.forEach(ctrl => houseGroup.get(ctrl)?.disable({ emitEvent: false }));
      } else {
        fields.forEach(ctrl => houseGroup.get(ctrl)?.enable({ emitEvent: false }));
      }
    });

    return houseGroup;
  }


  uploadDoc(event: any, index: number) {
  try {
    // Validate file type
    const isValidExtension = this.$common.checkForValidFile(event, false, true, false);
    if (!isValidExtension) return;

    const formData = new FormData();
    if (event.target.files && event.target.files[0]) {
      formData.append('file', event.target.files[0]);
    }

    // Upload file
    this.$miscellaneousService.documents(formData).subscribe(
      (response: any) => {
        if (response && response.url) {
          const filePath = `uploaded_files/${response.url}`;
          
          // ✅ Update the 'document' field of the specific house
          this.houses.at(index).get('document')?.setValue(filePath);

          this.toastr.success('Document uploaded successfully!');
        }
      },
      (err: any) => {
        console.error(err);
        this.toastr.error('Document upload failed!');
      }
    );
  } catch (error) {
    console.error(error);
    this.toastr.error('Something went wrong during document upload!');
  }
}


  viewImage(url: any) {
    window.open(this.baseUrl + '/' + url, '_blank');
  }

  isReadonlyType() {
    return this.Type === 'view';
  }


onSubmit() {
  if (this.rentForm.invalid) {
    this.toastr.error('Please fill all required fields', 'Error');
    return;
  }

  // Prepare payload
  const payload = {
    employee_id: this.employee_id,
    houses: this.rentForm.value.houses
  };

  console.log('Payload to send:', payload);

  // Send JSON payload (not FormData)
  this.PayrollService.createHousesOnRent(payload).subscribe({
    next: (res: any) => {
      if (res.code === 200) {
        this.toastr.success('Houses submitted successfully!');
        this.router.navigate(['/master/ess/upload-declaration/other-section']);
      } else {
        this.toastr.error(res.message || 'Something went wrong!');
      }
    },
    error: (err: any) => {
      console.error('Error:', err);
      this.toastr.error('Server error. Please try again later.');
    }
  });
}


}
