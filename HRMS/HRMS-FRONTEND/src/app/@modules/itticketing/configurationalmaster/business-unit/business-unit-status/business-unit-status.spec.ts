import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitStatus } from './business-unit-status';

describe('BusinessUnitStatus', () => {
  let component: BusinessUnitStatus;
  let fixture: ComponentFixture<BusinessUnitStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessUnitStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
