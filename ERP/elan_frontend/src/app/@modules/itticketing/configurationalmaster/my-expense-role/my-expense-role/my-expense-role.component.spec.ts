import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExpenseRoleComponent } from './my-expense-role.component';

describe('MyExpenseRoleComponent', () => {
  let component: MyExpenseRoleComponent;
  let fixture: ComponentFixture<MyExpenseRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyExpenseRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyExpenseRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
