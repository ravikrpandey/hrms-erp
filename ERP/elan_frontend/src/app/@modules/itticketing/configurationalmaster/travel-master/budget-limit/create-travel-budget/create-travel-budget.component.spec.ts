import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTravelBudgetComponent } from './create-travel-budget.component';

describe('CreateTravelBudgetComponent', () => {
  let component: CreateTravelBudgetComponent;
  let fixture: ComponentFixture<CreateTravelBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTravelBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTravelBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
