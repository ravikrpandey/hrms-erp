import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegisterCompalinComponent } from './add-register-compalin.component';

describe('AddRegisterCompalinComponent', () => {
  let component: AddRegisterCompalinComponent;
  let fixture: ComponentFixture<AddRegisterCompalinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegisterCompalinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRegisterCompalinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
