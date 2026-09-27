/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActionLeadFormSetupStatusComponent } from './action-lead-form-setup-status.component';

describe('ActionLeadFormSetupStatusComponent', () => {
  let component: ActionLeadFormSetupStatusComponent;
  let fixture: ComponentFixture<ActionLeadFormSetupStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionLeadFormSetupStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionLeadFormSetupStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
