import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalActionComponent } from './journal-action.component';

describe('JournalActionComponent', () => {
  let component: JournalActionComponent;
  let fixture: ComponentFixture<JournalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
