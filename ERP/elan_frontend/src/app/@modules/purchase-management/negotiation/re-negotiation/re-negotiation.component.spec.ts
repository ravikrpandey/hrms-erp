import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReNegotiationComponent } from './re-negotiation.component';

describe('ReNegotiationComponent', () => {
  let component: ReNegotiationComponent;
  let fixture: ComponentFixture<ReNegotiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReNegotiationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
