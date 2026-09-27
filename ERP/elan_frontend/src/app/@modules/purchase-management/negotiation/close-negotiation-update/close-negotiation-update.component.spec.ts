import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseNegotiationUpdateComponent } from './close-negotiation-update.component';

describe('CloseNegotiationUpdateComponent', () => {
  let component: CloseNegotiationUpdateComponent;
  let fixture: ComponentFixture<CloseNegotiationUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseNegotiationUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseNegotiationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
