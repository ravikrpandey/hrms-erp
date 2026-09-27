import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNegotiationComponent } from './create-negotiation.component';

describe('CreateNegotiationComponent', () => {
  let component: CreateNegotiationComponent;
  let fixture: ComponentFixture<CreateNegotiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNegotiationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
