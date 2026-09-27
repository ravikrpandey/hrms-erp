import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentJournalComponent } from './adjustment-journal.component';

describe('AdjustmentJournalComponent', () => {
  let component: AdjustmentJournalComponent;
  let fixture: ComponentFixture<AdjustmentJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
