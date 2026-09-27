import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedToDispatchComponent } from './proceed-to-dispatch.component';

describe('ProceedToDispatchComponent', () => {
  let component: ProceedToDispatchComponent;
  let fixture: ComponentFixture<ProceedToDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceedToDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProceedToDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
