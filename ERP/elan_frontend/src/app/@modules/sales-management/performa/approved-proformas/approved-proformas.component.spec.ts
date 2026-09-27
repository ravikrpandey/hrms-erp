import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedProformasComponent } from './approved-proformas.component';

describe('ApprovedProformasComponent', () => {
  let component: ApprovedProformasComponent;
  let fixture: ComponentFixture<ApprovedProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedProformasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
