import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetStatusComponent } from './budget-status.component';

describe('BudgetStatusComponent', () => {
  let component: BudgetStatusComponent;
  let fixture: ComponentFixture<BudgetStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
