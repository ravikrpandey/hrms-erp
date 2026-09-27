import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupWorkCalenderTableComponent } from './setup-work-calender-table.component';

describe('SetupWorkCalenderTableComponent', () => {
  let component: SetupWorkCalenderTableComponent;
  let fixture: ComponentFixture<SetupWorkCalenderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetupWorkCalenderTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupWorkCalenderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
