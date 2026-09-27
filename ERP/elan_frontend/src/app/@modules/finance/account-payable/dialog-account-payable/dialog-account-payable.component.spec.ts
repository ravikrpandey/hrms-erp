import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccountPayableComponent } from './dialog-account-payable.component';

describe('DialogAccountPayableComponent', () => {
  let component: DialogAccountPayableComponent;
  let fixture: ComponentFixture<DialogAccountPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAccountPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAccountPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
