import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationOffboardingComponent } from './all-resignation-offboarding.component';

describe('AllResignationOffboardingComponent', () => {
  let component: AllResignationOffboardingComponent;
  let fixture: ComponentFixture<AllResignationOffboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationOffboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationOffboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
