import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherExpenseComponent } from './add-other-expense.component';

describe('AddOtherExpenseComponent', () => {
  let component: AddOtherExpenseComponent;
  let fixture: ComponentFixture<AddOtherExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOtherExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOtherExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
