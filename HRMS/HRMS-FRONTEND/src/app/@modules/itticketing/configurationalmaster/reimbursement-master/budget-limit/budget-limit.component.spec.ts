import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetLimitComponent } from './budget-limit.component';

describe('BudgetLimitComponent', () => {
  let component: BudgetLimitComponent;
  let fixture: ComponentFixture<BudgetLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
