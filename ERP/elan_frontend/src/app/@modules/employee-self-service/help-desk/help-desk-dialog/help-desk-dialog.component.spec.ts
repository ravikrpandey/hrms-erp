import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeskDialogComponent } from './help-desk-dialog.component';

describe('HelpDeskDialogComponent', () => {
  let component: HelpDeskDialogComponent;
  let fixture: ComponentFixture<HelpDeskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeskDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
