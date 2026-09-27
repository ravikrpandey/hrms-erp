import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRateAgreementComponent } from './create-rate-agreement.component';

describe('CreateRateAgreementComponent', () => {
  let component: CreateRateAgreementComponent;
  let fixture: ComponentFixture<CreateRateAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRateAgreementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRateAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
