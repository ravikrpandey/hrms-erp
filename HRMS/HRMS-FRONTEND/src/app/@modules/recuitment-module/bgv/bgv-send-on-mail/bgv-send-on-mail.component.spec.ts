/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BgvSendOnMailComponent } from './bgv-send-on-mail.component';

describe('BgvSendOnMailComponent', () => {
  let component: BgvSendOnMailComponent;
  let fixture: ComponentFixture<BgvSendOnMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgvSendOnMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvSendOnMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
