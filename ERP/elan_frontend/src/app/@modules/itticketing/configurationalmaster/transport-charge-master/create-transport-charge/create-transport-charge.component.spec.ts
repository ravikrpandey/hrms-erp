import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransportChargeComponent } from './create-transport-charge.component';

describe('CreateTransportChargeComponent', () => {
  let component: CreateTransportChargeComponent;
  let fixture: ComponentFixture<CreateTransportChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransportChargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTransportChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
