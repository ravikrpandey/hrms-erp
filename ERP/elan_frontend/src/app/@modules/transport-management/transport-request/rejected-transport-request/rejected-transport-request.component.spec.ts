import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedTransportRequestComponent } from './rejected-transport-request.component';

describe('RejectedTransportRequestComponent', () => {
  let component: RejectedTransportRequestComponent;
  let fixture: ComponentFixture<RejectedTransportRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedTransportRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedTransportRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
