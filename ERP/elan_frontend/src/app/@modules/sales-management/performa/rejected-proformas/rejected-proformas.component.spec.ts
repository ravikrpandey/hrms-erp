import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedProformasComponent } from './rejected-proformas.component';

describe('RejectedProformasComponent', () => {
  let component: RejectedProformasComponent;
  let fixture: ComponentFixture<RejectedProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedProformasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
