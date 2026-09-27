import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetActionComponent } from './budget-action.component';

describe('BudgetActionComponent', () => {
  let component: BudgetActionComponent;
  let fixture: ComponentFixture<BudgetActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
