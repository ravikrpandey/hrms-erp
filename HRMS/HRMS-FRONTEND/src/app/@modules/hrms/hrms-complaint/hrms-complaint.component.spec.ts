import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsComplaintComponent } from './hrms-complaint.component';

describe('HrmsComplaintComponent', () => {
  let component: HrmsComplaintComponent;
  let fixture: ComponentFixture<HrmsComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrmsComplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrmsComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
