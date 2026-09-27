import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransportRequestComponent } from './create-transport-request.component';

describe('CreateTransportRequestComponent', () => {
  let component: CreateTransportRequestComponent;
  let fixture: ComponentFixture<CreateTransportRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransportRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTransportRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
