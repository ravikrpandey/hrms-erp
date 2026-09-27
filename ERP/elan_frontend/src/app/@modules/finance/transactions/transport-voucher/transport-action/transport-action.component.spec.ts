import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportActionComponent } from './transport-action.component';

describe('TransportActionComponent', () => {
  let component: TransportActionComponent;
  let fixture: ComponentFixture<TransportActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
