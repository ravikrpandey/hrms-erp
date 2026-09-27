import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectExpenseDialogueComponent } from './direct-expense-dialogue.component';

describe('DirectExpenseDialogueComponent', () => {
  let component: DirectExpenseDialogueComponent;
  let fixture: ComponentFixture<DirectExpenseDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectExpenseDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectExpenseDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
