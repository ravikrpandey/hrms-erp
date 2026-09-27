import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignActionPopupComponent } from './assign-action-popup.component';

describe('AssignActionPopupComponent', () => {
  let component: AssignActionPopupComponent;
  let fixture: ComponentFixture<AssignActionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignActionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignActionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
