/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CondidateProfileActionComponent } from './condidate-profile-action.component';

describe('CondidateProfileActionComponent', () => {
  let component: CondidateProfileActionComponent;
  let fixture: ComponentFixture<CondidateProfileActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondidateProfileActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondidateProfileActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
