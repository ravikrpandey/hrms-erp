import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPayableComponent } from './all-payable.component';

describe('AllPayableComponent', () => {
  let component: AllPayableComponent;
  let fixture: ComponentFixture<AllPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
