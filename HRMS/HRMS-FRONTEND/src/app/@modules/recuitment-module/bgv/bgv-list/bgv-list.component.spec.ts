/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BgvListComponent } from './bgv-list.component';

describe('BgvListComponent', () => {
  let component: BgvListComponent;
  let fixture: ComponentFixture<BgvListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BgvListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
