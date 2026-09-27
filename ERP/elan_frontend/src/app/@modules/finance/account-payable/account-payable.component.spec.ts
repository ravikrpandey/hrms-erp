import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayableComponent } from './account-payable.component';

describe('AccountPayableComponent', () => {
  let component: AccountPayableComponent;
  let fixture: ComponentFixture<AccountPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
