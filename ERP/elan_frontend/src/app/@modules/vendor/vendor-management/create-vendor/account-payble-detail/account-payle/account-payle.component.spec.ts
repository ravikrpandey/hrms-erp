import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPayleComponent } from './account-payle.component';

describe('AccountPayleComponent', () => {
  let component: AccountPayleComponent;
  let fixture: ComponentFixture<AccountPayleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPayleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPayleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
