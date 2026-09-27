import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestActionComponent } from './request-action.component';

describe('RequestActionComponent', () => {
  let component: RequestActionComponent;
  let fixture: ComponentFixture<RequestActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
