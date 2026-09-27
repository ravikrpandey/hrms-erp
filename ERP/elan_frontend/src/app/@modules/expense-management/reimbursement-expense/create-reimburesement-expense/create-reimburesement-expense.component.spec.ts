import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReimburesementExpenseComponent } from './create-reimburesement-expense.component';

describe('CreateReimburesementExpenseComponent', () => {
  let component: CreateReimburesementExpenseComponent;
  let fixture: ComponentFixture<CreateReimburesementExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReimburesementExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReimburesementExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
