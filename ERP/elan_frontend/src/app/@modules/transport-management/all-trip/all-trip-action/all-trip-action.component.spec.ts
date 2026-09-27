import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTripActionComponent } from './all-trip-action.component';

describe('AllTripActionComponent', () => {
  let component: AllTripActionComponent;
  let fixture: ComponentFixture<AllTripActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTripActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTripActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
