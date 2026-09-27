import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionChargeCreate } from './deduction-charge-create';

describe('DeductionChargeCreate', () => {
  let component: DeductionChargeCreate;
  let fixture: ComponentFixture<DeductionChargeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionChargeCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionChargeCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
