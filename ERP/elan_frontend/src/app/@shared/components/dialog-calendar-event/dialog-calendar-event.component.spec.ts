import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogeCalendarEventComponent } from './dialog-calendar-event.component';

describe('DialogCalendarEventComponent', () => {
  let component: DialogeCalendarEventComponent;
  let fixture: ComponentFixture<DialogeCalendarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogeCalendarEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogeCalendarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
