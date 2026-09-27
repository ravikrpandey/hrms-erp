import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetExtendListComponent } from './budget-extend-list.component';

describe('BudgetExtendListComponent', () => {
  let component: BudgetExtendListComponent;
  let fixture: ComponentFixture<BudgetExtendListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetExtendListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetExtendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
