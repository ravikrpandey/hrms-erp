import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsCreateComponent } from './earnings-create.component';

describe('EarningsCreateComponent', () => {
  let component: EarningsCreateComponent;
  let fixture: ComponentFixture<EarningsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarningsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
