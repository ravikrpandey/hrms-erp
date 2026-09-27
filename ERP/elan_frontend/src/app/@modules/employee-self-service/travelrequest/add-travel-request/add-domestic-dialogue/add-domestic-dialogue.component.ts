import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
  selector: 'app-add-domestic-dialogue',
  templateUrl: './add-domestic-dialogue.component.html',
  styleUrls: ['./add-domestic-dialogue.component.scss'],
})
export class AddDomesticDialogueComponent {
  fromStateData: any;
  toStateData: any;
  fromCityList: any;
  toCityList: any;
  fullFromCityList: any = [];
  fullToCityList: any = [];
  journeyToCityList: any = [...this.fullFromCityList, ...this.fullToCityList];
  view: boolean = false;
  formModel: FormGroup;
  stateList: any;
  toStateList: any;
  toStateList2: any;
  toCityList2: any;
  fromCityList2: any;
  stateList2: any;
  states: any;
  cities: any;
  toCities: any;
  toStates: any;

  constructor(
    public dialog: MatDialogRef<AddDomesticDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private travelRequest: TravelRequestService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    this.formModel = this.fb.group({
      domestic_from_state_id: [null, Validators.required],
      fromStateName: [''],
      domestic_to_state_id: [null, Validators.required],
      toStateName: [''],
      domestic_from_city_id: [null, Validators.required],
      fromCityName: [''],
      domestic_to_city_id: [null, Validators.required],
      toCityName: [''],
      domestic_from_date: [null, Validators.required],
      domestic_to_date: [null, Validators.required],
      include_hotel: [false],
      domestic_hotel_name: [null, [noLeadingSpaces()]],
      number_of_days: [0],
      journeyBifurcation: this.fb.array([]),
    });

    if (this.data?.view) {
      this.view = this.data.view;
      // this.formModel.disable();
    }
    if (this.data?.id) {
      this.formModel.patchValue(this.data.tableData);
      console.log(
        'Form data for editing:',
        this.data.tableData.journeyBifurcation
      );
      if (
        Array.isArray(this.data.tableData.journeyBifurcation) &&
        this.data.tableData.journeyBifurcation.length > 0
      ) {
        this.data.tableData.journeyBifurcation.forEach((journey: any) => {
          const journeyGroup = this.createJourneyBifurcation();
          journeyGroup.patchValue({
            travel_from_city_id: journey.travel_from_city_id,
            travel_to_city_id: journey.travel_to_city_id,
            from_date: journey.from_date,
          });
          this.journeyBifurcation.push(journeyGroup);
        });
      }
    }
  }

  get journeyBifurcation(): FormArray {
    return this.formModel.get('journeyBifurcation') as FormArray;
  }

  ngOnInit() {
    this.getAllstates();

    // Load initial data for editing
    if (this.data?.id) {
      const tableData = this.data.tableData;

      this.formModel.patchValue(tableData);

      if (tableData.domestic_from_state_id) {
        this.getCitiesByStateId(tableData.domestic_from_state_id, 'from');
      }
      if (tableData.domestic_to_state_id) {
        this.getCitiesByStateId(tableData.domestic_to_state_id, 'to');
      }
    } else {
    this.addJourney();
    }
  }

  ngAfterViewInit() {
    if (this.view) {
      this.disableInteraction();
    }
  }

  disableInteraction() {
    const formElements =
      this.elRef.nativeElement.querySelectorAll('.form_set .row *');

    formElements.forEach((element: HTMLElement) => {
      this.renderer.addClass(element, 'disable-interaction');
      this.renderer.setAttribute(element, 'tabindex', '-1');
      element.addEventListener('focus', (event) => {
        (event.target as HTMLElement).blur();
      });
    });
  }

  onSubmit(): void {
    Object.values(this.formModel.controls).forEach((control) => {
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
      let index = this.data.id - 1;

      const entry = this.data.domesticdatedata[index];
      const fromDate = new Date(entry.domestic_from_date).setHours(0, 0, 0, 0);
      const toDate = new Date(entry.domestic_to_date).setHours(0, 0, 0, 0);

      if (d.getTime() >= fromDate && d.getTime() <= toDate) return true;

      return false;
    } else if (
      this.data.domesticdatedata &&
      this.data.domesticdatedata.length > 0
    ) {
      for (let entry of this.data.domesticdatedata) {
        const toDate = new Date(entry.domestic_to_date).setHours(0, 0, 0, 0);
        if (!maxDate || toDate > maxDate.getTime()) {
          maxDate = new Date(toDate);
        }
      }
    } else if (
      this.data.internationaldatedata &&
      this.data.internationaldatedata.length > 0
    ) {
      for (let entry of this.data.internationaldatedata) {
        const toDate = new Date(entry.international_to_date).setHours(
          0,
          0,
          0,
          0
        );
        if (!maxDate || toDate > maxDate.getTime()) {
          maxDate = new Date(toDate);
        }
      }
    }

    if (maxDate && d.getTime() <= maxDate.getTime()) return false;

    return true;
  };

  calculateDays(): void {
    const fromDate = this.formModel.get('domestic_from_date')?.value;
    const toDate = this.formModel.get('domestic_to_date')?.value;

    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      if (toDateObj < fromDateObj) {
        this.formModel
          .get('domestic_to_date')
          ?.setErrors({ invalidDateRange: true });
        this.toaster.error(
          'To Date must be greater than or equal to From Date'
        );
      } else {
        let isValidToDate = true;
        if (
          this.data.domesticdatedata &&
          this.data.domesticdatedata.length > 0
        ) {
          for (let entry of this.data.domesticdatedata) {
            const fromRange = new Date(entry.domestic_from_date).setHours(
              0,
              0,
              0,
              0
            );
            const toRange = new Date(entry.domestic_to_date).setHours(
              0,
              0,
              0,
              0
            );

            if (
              fromDateObj.getTime() >= fromRange &&
              fromDateObj.getTime() <= toRange
            ) {
              isValidToDate =
                toDateObj.getTime() >= fromDateObj.getTime() &&
                toDateObj.getTime() <= toRange;
              break;
            }
          }
        }

        if (!isValidToDate) {
          this.formModel
            .get('domestic_to_date')
            ?.setErrors({ invalidToDateRange: true });
          this.toaster.error(
            'To Date must be within the allowed range of the selected From Date'
          );
        } else {
          fromDateObj.setHours(0, 0, 0, 0);
          toDateObj.setHours(0, 0, 0, 0);

          const timeDiff = toDateObj.getTime() - fromDateObj.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;

          this.formModel
            .get('number_of_days')
            ?.setValue(daysDiff >= 0 ? daysDiff : 0);
          this.formModel.get('domestic_to_date')?.setErrors(null);
        }
      }
    } else {
      this.formModel.get('number_of_days')?.setValue(0);
    }
  }

  getAllstates() {
    this.travelRequest.getAllstates().subscribe((res: any) => {
      this.stateList = res.data;
      this.stateList2 = res.data;
      this.toStateList = res.data;
      this.toStateList2 = res.data;
      this.states = this.stateList.map((value: any) => value.states_name);
      this.toStates = this.stateList.map((value: any) => value.states_name);
    });
  }

  fromStateChange(e: any) {
    const selectedState = this.stateList.find(
      (state: any) => state.states_id === e.value
    );
    this.formModel
      .get('fromStateName')
      ?.setValue(selectedState?.states_name || '');
    this.getCitiesByStateId(e?.value, 'from');
  }

  toStateChange(e: any) {
    const selectedState = this.stateList.find(
      (state: any) => state.states_id === e.value
    );
    this.formModel
      .get('toStateName')
      ?.setValue(selectedState?.states_name || '');
    this.getCitiesByStateId(e?.value, 'to');
  }

  toCityChange(e: any) {
    this.formModel
      .get('toCityName')
      ?.setValue(
        this.toCityList.find((city: any) => city.city_id === e.value)
          ?.city_name || ''
      );
    this.filterCityLists();
  }

  fromCityChange(e: any) {
    this.formModel
      .get('fromCityName')
      ?.setValue(
        this.fromCityList.find((city: any) => city.city_id === e.value)
          ?.city_name || ''
      );
    this.filterCityLists();
  }

  getCitiesByStateId(stateId: any, type: string) {
    this.travelRequest.getcitybystateid(stateId).subscribe((res: any) => {
      if (res && res?.data) {
        if (type === 'from') {
          this.fullFromCityList = res?.data;
          this.fromCityList = res?.data;
          this.journeyToCityList = [
            ...this.fullFromCityList,
            ...this.fullToCityList,
          ];

          this.filterCityLists();
        } else {
          this.fullToCityList = res?.data;
          this.journeyToCityList = [
            ...this.fullFromCityList,
            ...this.fullToCityList,
          ];
          this.filterCityLists();
        }
      }
      const formControl =
        type === 'from'
          ? this.formModel.get('fromCityName')
          : this.formModel.get('toCityName');
      const cityName =
        type === 'from'
          ? this.fullFromCityList.find(
              (city: any) =>
                city.city_id ===
                this.formModel.get('domestic_from_city_id')?.value
            )?.city_name
          : this.fullToCityList.find(
              (city: any) =>
                city.city_id ===
                this.formModel.get('domestic_to_city_id')?.value
            )?.city_name;

      formControl?.setValue(cityName || '');
    });
  }

  filterCityLists() {
    const fromCityId = this.formModel.get('domestic_from_city_id')?.value;
    const toCityId = this.formModel.get('domestic_to_city_id')?.value;

    this.fromCityList = this.fullFromCityList.filter(
      (city: any) => city.city_id !== toCityId
    );
    this.toCityList = this.fullToCityList.filter(
      (city: any) => city.city_id !== fromCityId
    );
    this.fromCityList2 = this.fromCityList;
    this.toCityList2 = this.toCityList;
    this.cities = this.fromCityList.map((value: any) => value.city_name);
    this.toCities = this.toCityList.map((value: any) => value.city_name);
  }

  stateSearch(e: any) {
    const aa = e;
    let filteredVariable = this.stateList2.filter((item: any) =>
      aa.includes(item.states_name)
    );
    this.stateList = filteredVariable;
  }

  citySearch(e: any) {
    const aa = e;
    let filteredVariable = this.fromCityList2.filter((item: any) =>
      aa.includes(item.city_name)
    );
    this.fromCityList = filteredVariable;
  }

  toStateSearch(e: any) {
    const aa = e;
    let filteredVariable = this.toStateList2.filter((item: any) =>
      aa.includes(item.states_name)
    );
    this.toStateList = filteredVariable;
  }

  toCitySearch(e: any) {
    const aa = e;
    let filteredVariable = this.toCityList2.filter((item: any) =>
      aa.includes(item.city_name)
    );
    this.toCityList = filteredVariable;
  }

  addJourney(): void {
    const fb = this.createJourneyBifurcation();
    this.journeyBifurcation.push(fb);
  }

  removeJourney(index: number): void {
    this.journeyBifurcation.removeAt(index);
  }

  createJourneyBifurcation(): FormGroup {
    return this.fb.group({
      travel_from_city_id: [null],
      travel_to_city_id: [null],
      from_date: [null],
    });
  }
}
