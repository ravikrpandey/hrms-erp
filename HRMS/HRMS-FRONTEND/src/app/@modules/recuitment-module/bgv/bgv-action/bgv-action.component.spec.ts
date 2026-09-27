/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BgvActionComponent } from './bgv-action.component';

describe('BgvActionComponent', () => {
  let component: BgvActionComponent;
  let fixture: ComponentFixture<BgvActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgvActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
