import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnfStateDownlordComponent } from './fnf-state-downlord.component';

describe('FnfStateDownlordComponent', () => {
  let component: FnfStateDownlordComponent;
  let fixture: ComponentFixture<FnfStateDownlordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FnfStateDownlordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FnfStateDownlordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
