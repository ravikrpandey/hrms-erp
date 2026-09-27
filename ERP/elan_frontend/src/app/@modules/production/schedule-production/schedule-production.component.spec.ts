import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleProductionComponent } from './schedule-production.component';

describe('ScheduleProductionComponent', () => {
  let component: ScheduleProductionComponent;
  let fixture: ComponentFixture<ScheduleProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
