import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledJournalDetailsComponent } from './scheduled-journal-details.component';

describe('ScheduledJournalDetailsComponent', () => {
  let component: ScheduledJournalDetailsComponent;
  let fixture: ComponentFixture<ScheduledJournalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledJournalDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledJournalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
