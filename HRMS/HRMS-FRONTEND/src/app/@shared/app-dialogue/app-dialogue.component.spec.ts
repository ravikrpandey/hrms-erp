import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialogueComponent } from './app-dialogue.component';

describe('AppDialogueComponent', () => {
  let component: AppDialogueComponent;
  let fixture: ComponentFixture<AppDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDialogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
