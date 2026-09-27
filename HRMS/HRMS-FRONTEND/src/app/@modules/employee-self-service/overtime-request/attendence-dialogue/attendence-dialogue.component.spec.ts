import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceDialogueComponent } from './attendence-dialogue.component';

describe('AttendenceDialogueComponent', () => {
  let component: AttendenceDialogueComponent;
  let fixture: ComponentFixture<AttendenceDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendenceDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendenceDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
