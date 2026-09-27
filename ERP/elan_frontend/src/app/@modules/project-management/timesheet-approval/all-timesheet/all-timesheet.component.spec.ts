import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTimesheetComponent } from './all-timesheet.component';

describe('AllTimesheetComponent', () => {
  let component: AllTimesheetComponent;
  let fixture: ComponentFixture<AllTimesheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTimesheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
