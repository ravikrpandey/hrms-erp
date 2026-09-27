import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingActionsComponent } from './tracking-actions.component';

describe('TrackingActionsComponent', () => {
  let component: TrackingActionsComponent;
  let fixture: ComponentFixture<TrackingActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
