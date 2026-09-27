/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActionLeadFormSetupMandatoryComponent } from './action-lead-form-setup-mandatory.component';

describe('ActionLeadFormSetupMandatoryComponent', () => {
  let component: ActionLeadFormSetupMandatoryComponent;
  let fixture: ComponentFixture<ActionLeadFormSetupMandatoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionLeadFormSetupMandatoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionLeadFormSetupMandatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
