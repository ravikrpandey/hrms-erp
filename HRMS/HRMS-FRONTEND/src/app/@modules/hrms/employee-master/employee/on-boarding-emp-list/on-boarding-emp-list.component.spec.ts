import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardingEmpListComponent } from './on-boarding-emp-list.component';

describe('OnBoardingEmpListComponent', () => {
  let component: OnBoardingEmpListComponent;
  let fixture: ComponentFixture<OnBoardingEmpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardingEmpListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnBoardingEmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
