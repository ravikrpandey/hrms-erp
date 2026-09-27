import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgePlanningComponent } from './acknowledge-planning.component';

describe('AcknowledgePlanningComponent', () => {
  let component: AcknowledgePlanningComponent;
  let fixture: ComponentFixture<AcknowledgePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgePlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
