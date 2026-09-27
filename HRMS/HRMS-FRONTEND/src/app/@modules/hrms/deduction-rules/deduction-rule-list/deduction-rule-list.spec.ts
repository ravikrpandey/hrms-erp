import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionRuleList } from './deduction-rule-list';

describe('DeductionRuleList', () => {
  let component: DeductionRuleList;
  let fixture: ComponentFixture<DeductionRuleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeductionRuleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionRuleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
