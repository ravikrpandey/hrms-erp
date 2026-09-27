import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPlanDialogComponent } from './travel-plan-dialog.component';

describe('TravelPlanDialogComponent', () => {
  let component: TravelPlanDialogComponent;
  let fixture: ComponentFixture<TravelPlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelPlanDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
