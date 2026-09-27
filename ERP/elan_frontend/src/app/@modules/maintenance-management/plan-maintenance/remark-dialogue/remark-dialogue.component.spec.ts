import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkDialogueComponent } from './remark-dialogue.component';

describe('RemarkDialogueComponent', () => {
  let component: RemarkDialogueComponent;
  let fixture: ComponentFixture<RemarkDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
