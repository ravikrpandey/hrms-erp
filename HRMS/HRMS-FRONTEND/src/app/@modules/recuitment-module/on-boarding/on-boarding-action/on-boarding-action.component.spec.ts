import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingActionComponent } from './on-boarding-action.component';

describe('OnBoardingActionComponent', () => {
  let component: OnBoardingActionComponent;
  let fixture: ComponentFixture<OnBoardingActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardingActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnBoardingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
