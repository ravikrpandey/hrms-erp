import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJournalsComponent } from './scheduled-journals.component';

describe('ScheduledJournalsComponent', () => {
  let component: ScheduledJournalsComponent;
  let fixture: ComponentFixture<ScheduledJournalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledJournalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
