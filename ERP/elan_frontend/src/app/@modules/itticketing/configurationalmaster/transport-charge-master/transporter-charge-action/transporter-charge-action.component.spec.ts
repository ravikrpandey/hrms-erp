import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterChargeActionComponent } from './transporter-charge-action.component';

describe('TransporterChargeActionComponent', () => {
  let component: TransporterChargeActionComponent;
  let fixture: ComponentFixture<TransporterChargeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterChargeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporterChargeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
