import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionActionComponent } from './deduction-action.component';

describe('DeductionActionComponent', () => {
  let component: DeductionActionComponent;
  let fixture: ComponentFixture<DeductionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
