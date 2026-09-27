import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComplainComponent } from './register-complain.component';

describe('RegisterComplainComponent', () => {
  let component: RegisterComplainComponent;
  let fixture: ComponentFixture<RegisterComplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComplainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
