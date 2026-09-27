import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitFormActionsComponent } from './exit-form-actions.component';

describe('ExitFormActionsComponent', () => {
  let component: ExitFormActionsComponent;
  let fixture: ComponentFixture<ExitFormActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExitFormActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitFormActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
