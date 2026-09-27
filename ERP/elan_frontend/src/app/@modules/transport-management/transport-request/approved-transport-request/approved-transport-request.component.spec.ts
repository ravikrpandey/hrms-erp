import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTransportRequestComponent } from './approved-transport-request.component';

describe('ApprovedTransportRequestComponent', () => {
  let component: ApprovedTransportRequestComponent;
  let fixture: ComponentFixture<ApprovedTransportRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedTransportRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedTransportRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
