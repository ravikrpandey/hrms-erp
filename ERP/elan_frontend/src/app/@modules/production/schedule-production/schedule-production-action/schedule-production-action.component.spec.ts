import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProductionActionComponent } from './schedule-production-action.component';

describe('ScheduleProductionActionComponent', () => {
  let component: ScheduleProductionActionComponent;
  let fixture: ComponentFixture<ScheduleProductionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleProductionActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleProductionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
