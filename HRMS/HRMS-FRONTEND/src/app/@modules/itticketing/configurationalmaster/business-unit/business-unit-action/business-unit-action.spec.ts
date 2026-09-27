import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitAction } from './business-unit-action';

describe('BusinessUnitAction', () => {
  let component: BusinessUnitAction;
  let fixture: ComponentFixture<BusinessUnitAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessUnitAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
