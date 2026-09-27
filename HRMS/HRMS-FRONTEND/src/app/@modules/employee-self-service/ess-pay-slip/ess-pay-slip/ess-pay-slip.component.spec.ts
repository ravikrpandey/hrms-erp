import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssPaySlipComponent } from './ess-pay-slip.component';

describe('EssPaySlipComponent', () => {
  let component: EssPaySlipComponent;
  let fixture: ComponentFixture<EssPaySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssPaySlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EssPaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
