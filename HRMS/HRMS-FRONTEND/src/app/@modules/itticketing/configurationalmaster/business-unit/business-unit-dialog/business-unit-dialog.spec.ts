import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUnitDialog } from './business-unit-dialog';

describe('BusinessUnitDialog', () => {
  let component: BusinessUnitDialog;
  let fixture: ComponentFixture<BusinessUnitDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessUnitDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUnitDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
