import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayableDetailsComponent } from './account-payable-details.component';

describe('AccountPayableDetailsComponent', () => {
  let component: AccountPayableDetailsComponent;
  let fixture: ComponentFixture<AccountPayableDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPayableDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPayableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
