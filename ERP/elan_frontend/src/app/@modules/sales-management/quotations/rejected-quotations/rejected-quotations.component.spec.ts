import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedQuotationsComponent } from './rejected-quotations.component';

describe('RejectedQuotationsComponent', () => {
  let component: RejectedQuotationsComponent;
  let fixture: ComponentFixture<RejectedQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
