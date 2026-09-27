import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedRfpComponent } from './closed-rfp.component';

describe('ClosedRfpComponent', () => {
  let component: ClosedRfpComponent;
  let fixture: ComponentFixture<ClosedRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
