import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleActionComponent } from './schedule-action.component';

describe('ScheduleActionComponent', () => {
  let component: ScheduleActionComponent;
  let fixture: ComponentFixture<ScheduleActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
