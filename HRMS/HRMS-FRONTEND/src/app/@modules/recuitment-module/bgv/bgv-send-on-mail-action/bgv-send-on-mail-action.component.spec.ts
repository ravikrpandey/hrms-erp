/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BgvSendOnMailActionComponent } from './bgv-send-on-mail-action.component';

describe('BgvSendOnMailActionComponent', () => {
  let component: BgvSendOnMailActionComponent;
  let fixture: ComponentFixture<BgvSendOnMailActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgvSendOnMailActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvSendOnMailActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
