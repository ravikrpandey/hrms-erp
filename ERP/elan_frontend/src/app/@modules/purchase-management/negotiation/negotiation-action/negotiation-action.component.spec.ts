import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationActionComponent } from './negotiation-action.component';

describe('NegotiationActionComponent', () => {
  let component: NegotiationActionComponent;
  let fixture: ComponentFixture<NegotiationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NegotiationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegotiationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
