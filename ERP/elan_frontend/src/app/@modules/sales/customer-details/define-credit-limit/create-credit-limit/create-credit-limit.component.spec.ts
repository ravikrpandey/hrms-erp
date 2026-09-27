import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCreditLimitComponent } from './create-credit-limit.component';

describe('CreateCreditLimitComponent', () => {
  let component: CreateCreditLimitComponent;
  let fixture: ComponentFixture<CreateCreditLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCreditLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
