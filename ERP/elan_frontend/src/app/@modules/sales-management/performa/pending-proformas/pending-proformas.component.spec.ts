import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingProformasComponent } from './pending-proformas.component';

describe('PendingProformasComponent', () => {
  let component: PendingProformasComponent;
  let fixture: ComponentFixture<PendingProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingProformasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
