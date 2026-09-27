import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsActionComponent } from './earnings-action.component';

describe('EarningsActionComponent', () => {
  let component: EarningsActionComponent;
  let fixture: ComponentFixture<EarningsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
