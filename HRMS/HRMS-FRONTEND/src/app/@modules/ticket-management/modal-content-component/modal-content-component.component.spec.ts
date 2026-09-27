import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContentComponentComponent } from './modal-content-component.component';

describe('ModalContentComponentComponent', () => {
  let component: ModalContentComponentComponent;
  let fixture: ComponentFixture<ModalContentComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalContentComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalContentComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
