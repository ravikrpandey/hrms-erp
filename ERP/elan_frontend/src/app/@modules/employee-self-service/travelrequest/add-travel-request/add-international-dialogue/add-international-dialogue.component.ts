
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-add-international-dialogue',
  templateUrl: './add-international-dialogue.component.html',
  styleUrls: ['./add-international-dialogue.component.scss']
})
export class AddInternationalDialogueComponent {
  countryList: any;
  fromStateData: any;
  toStateData: any;
  fromCityList: any;
  toCityList: any;
  view: boolean = false;
  formModel: FormGroup;
  toCityList2: any;
  toStateData2: any;
  toCountryList2: any;
  toCountryList: any;
  fromCityList2: any;
  fromStateData2: any;
  countryList2: any;
  fromCountries: any;
  toCountries: any;
  fromStates: any;
  toStates: any;
  fromCities: any;
  toCities: any;

  constructor(
    public dialog: MatDialogRef<AddInternationalDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private travelRequest: TravelRequestService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {

    this.formModel = this.fb.group({
      international_from_country_id: [null, Validators.required],
      fromCountryName: [''],
      international_to_country_id: [null, Validators.required],
      toCountryName: [''],
      international_from_state_id: [null, Validators.required],
      fromStateName: [''],
      international_to_state_id: [null, Validators.required],
      toStateName: [''],
      international_from_city_id: [null, Validators.required],
      fromCityName: [''],
      international_to_city_id: [null, Validators.required],
      toCityName: [''],
      international_from_date: [null, Validators.required],
      international_to_date: [null, Validators.required],
      include_hotel: [false],
      international_hotel_name: [null,[noLeadingSpaces()]],
      number_of_days: [0]
    });

    if (this.data?.view) {
      this.view = this.data.view;
    }
    if (this.data?.id) {
      this.formModel.patchValue(this.data.tableData);
    }
  }

  ngOnInit() {
    this.getAllCountry();

    // Load initial data for editing
    if (this.data?.id) {
      const tableData = this.data.tableData;

      this.formModel.patchValue(tableData);

      // Load states and cities based on initial values
      if (tableData.international_from_country_id) {
        this.getStatesByCountryId(tableData.international_from_country_id, 'from', () => {
          if (tableData.international_from_state_id) {
            this.getCitiesByStateId(tableData.international_from_state_id, 'from');
          }
        });
      }

      if (tableData.international_to_country_id) {
        this.getStatesByCountryId(tableData.international_to_country_id, 'to', () => {
          if (tableData.international_to_state_id) {
            this.getCitiesByStateId(tableData.international_to_state_id, 'to');
          }
        });
      }
    }
  }

  ngAfterViewInit() {
    if (this.view) {
      this.disableInteraction();
    }
  }

  disableInteraction() {
    const formElements = this.elRef.nativeElement.querySelectorAll('.form_set .row *');
    
    formElements.forEach((element: HTMLElement) => {
      this.renderer.addClass(element, 'disable-interaction');
      this.renderer.setAttribute(element, 'tabindex', '-1');
      element.addEventListener('focus', (event) => {
        (event.target as HTMLElement).blur();
      });
    });
  }

  onSubmit(): void {
    Object.values(this.formModel.controls).forEach(control => {
      control.markAsTouched();
  });
    if (this.formModel.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }
    console.log('Form submitted:', this.formModel.value);
    this.dialog.close(this.formModel.value);
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    let maxDate: Date | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (d.getTime() < today.getTime()) return false;
  
    if (this.data?.id) {
      let index = this.data.id -1
      
        const entry = this.data.internationaldatedata[index];
        const fromDate = new Date(entry.international_from_date).setHours(0, 0, 0, 0);
        const toDate = new Date(entry.international_to_date).setHours(0, 0, 0, 0);
  
        if (d.getTime() >= fromDate && d.getTime() <= toDate) return true;
  
        return false;
    }
    else if (this.data.domesticdatedata && this.data.domesticdatedata.length > 0) {
        for (let entry of this.data.domesticdatedata) {
          const toDate = new Date(entry.domestic_to_date).setHours(0, 0, 0, 0);
          if (!maxDate || toDate > maxDate.getTime()) {
            maxDate = new Date(toDate);
          }
        }
    }
    else if (this.data.internationaldatedata && this.data.internationaldatedata.length > 0) {
        for (let entry of this.data.internationaldatedata) {
          const toDate = new Date(entry.international_to_date).setHours(0, 0, 0, 0);
          if (!maxDate || toDate > maxDate.getTime()) {
            maxDate = new Date(toDate);
          }
        }
    }
  
  
    if (maxDate && d.getTime() <= maxDate.getTime()) return false;
  
    return true;
  };
  
  
  calculateDays(): void {
    const fromDate = this.formModel.get('international_from_date')?.value;
    const toDate = this.formModel.get('international_to_date')?.value;
  
    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
  
      if (toDateObj < fromDateObj) {
        this.formModel.get('international_to_date')?.setErrors({ 'invalidDateRange': true });
        this.toaster.error('To Date must be greater than or equal to From Date');
      } else {
        let isValidToDate = true;
        if (this.data.domesticdatedata && this.data.domesticdatedata.length > 0) {
          for (let entry of this.data.domesticdatedata) {
            const fromRange = new Date(entry.domestic_from_date).setHours(0, 0, 0, 0);
            const toRange = new Date(entry.domestic_to_date).setHours(0, 0, 0, 0);
            
            if (fromDateObj.getTime() >= fromRange && fromDateObj.getTime() <= toRange) {
              isValidToDate = toDateObj.getTime() >= fromDateObj.getTime() && toDateObj.getTime() <= toRange;
              break;
            }
          }
        }
  
        if (!isValidToDate) {
          this.formModel.get('international_to_date')?.setErrors({ 'invalidToDateRange': true });
          this.toaster.error('To Date must be within the allowed range of the selected From Date');
        } else {
          fromDateObj.setHours(0, 0, 0, 0);
          toDateObj.setHours(0, 0, 0, 0);
  
          const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
  
          this.formModel.get('number_of_days')?.setValue(daysDiff >= 0 ? daysDiff : 0);
          this.formModel.get('international_to_date')?.setErrors(null); 
        }
      }
    } else {
      this.formModel.get('number_of_days')?.setValue(0);
    }
  }

  getAllCountry() {
    this.travelRequest.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.countryList2 = res.data;
        this.toCountryList = res.data;
        this.toCountryList2 = res.data;
        this.fromCountries = this.countryList.map((value:any) => value.countryss_name)
        this.toCountries = this.countryList.map((value:any) => value.countryss_name)
      })
  };

  fromCountryChange(e: any) {
    const selectedCountry = this.countryList.find((country: any) => country.countryss_id === e.value);
    this.formModel.get('fromCountryName')?.setValue(selectedCountry?.countryss_name || '');
    this.getStatesByCountryId(e?.value, 'from');
  }
  
  toCountryChange(e: any) {
    const selectedCountry = this.countryList.find((country: any) => country.countryss_id === e.value);
    this.formModel.get('toCountryName')?.setValue(selectedCountry?.countryss_name || '');
    this.getStatesByCountryId(e?.value, 'to');
  }
  
  getStatesByCountryId(countryId: any, type: string, callback?: () => void) {
    this.travelRequest.getstatesbycountryid(countryId).subscribe(
      (res: any) => {
        if (res && res?.data) {
          if (type === 'from') {
            this.fromStateData = res?.data;
            this.fromStateData2 = res?.data;
            this.fromStates = this.fromStateData.map((value:any) => value.states_name)
          } else {
            this.toStateData = res?.data;
            this.toStateData2 = res?.data;
            this.toStates = this.toStateData.map((value:any) => value.states_name)
          }
          if (callback) callback();
        }
      }
    );
  }

  fromStateChange(e: any) {
    const selectedState = this.fromStateData.find((state: any) => state.states_id === e.value);
    this.formModel.get('fromStateName')?.setValue(selectedState?.states_name || '');
    this.getCitiesByStateId(e?.value, 'from');
  }
  
  toStateChange(e: any) {
    const selectedState = this.toStateData.find((state: any) => state.states_id === e.value);
    this.formModel.get('toStateName')?.setValue(selectedState?.states_name || '');
    this.getCitiesByStateId(e?.value, 'to');
  }

  toCityChange(e: any) {
    const selectedState = this.toCityList.find((city: any) => city.city_id === e.value);
    this.formModel.get('toCityName')?.setValue(selectedState?.city_name || '');
  }

  fromCityChange(e: any) {
    const selectedState = this.fromCityList.find((city: any) => city.city_id === e.value);
    this.formModel.get('fromCityName')?.setValue(selectedState?.city_name || '');
  }

  getCitiesByStateId(stateId: any, type: string) {
    this.travelRequest.getcitybystateid(stateId).subscribe(
      (res: any) => {
        if (res && res?.data) {
          if (type === 'from') {
            this.fromCityList = res?.data;
            this.fromCityList2 = res?.data;
            this.fromCities = this.fromCityList.map((value:any) => value.city_name)
          } else {
            this.toCityList = res?.data;
            this.toCityList2 = res?.data;
            this.toCities = this.toCityList.map((value:any) => value.city_name)
          }
        }
        const formControl = type === 'from' ? this.formModel.get('fromCityName') : this.formModel.get('toCityName');
        const cityName = type === 'from'
          ? this.fromCityList.find((city: any) => city.city_id === this.formModel.get('international_from_city_id')?.value)?.city_name
          : this.toCityList.find((city: any) => city.city_id === this.formModel.get('international_to_city_id')?.value)?.city_name;

        formControl?.setValue(cityName || '');
      }
    );
  }

  fromCountrySearch(e: any) {
    const aa = e
    let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
  }

  fromStateSearch(e: any) {
    const aa = e
    let filteredVariable = this.fromStateData2.filter((item: any) => aa.includes(item.states_name));
    this.fromStateData = filteredVariable
  }

  fromCitySearch(e: any) {
    const aa = e
    let filteredVariable = this.fromCityList2.filter((item: any) => aa.includes(item.city_name));
    this.fromCityList = filteredVariable
  }

  toCountrySearch(e: any) {
    const aa = e
    let filteredVariable = this.toCountryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.toCountryList = filteredVariable
  }

  toStateSearch(e: any) {
    const aa = e
    let filteredVariable = this.toStateData2.filter((item: any) => aa.includes(item.states_name));
    this.toStateData = filteredVariable
  }

  toCitySearch(e: any) {
    const aa = e
    let filteredVariable = this.toCityList2.filter((item: any) => aa.includes(item.city_name));
    this.toCityList = filteredVariable
  }

}


