import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionCreateComponent } from './deduction-create.component';

describe('DeductionCreateComponent', () => {
  let component: DeductionCreateComponent;
  let fixture: ComponentFixture<DeductionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
