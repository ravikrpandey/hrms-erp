import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportChargeMasterComponent } from './transport-charge-master.component';

describe('TransportChargeMasterComponent', () => {
  let component: TransportChargeMasterComponent;
  let fixture: ComponentFixture<TransportChargeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportChargeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportChargeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
