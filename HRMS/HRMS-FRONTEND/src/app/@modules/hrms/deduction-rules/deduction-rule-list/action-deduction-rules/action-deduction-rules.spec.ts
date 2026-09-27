import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDeductionRules } from './action-deduction-rules';

describe('ActionDeductionRules', () => {
  let component: ActionDeductionRules;
  let fixture: ComponentFixture<ActionDeductionRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionDeductionRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDeductionRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
