import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceCreateComponent } from './allowance-create.component';

describe('AllowanceCreateComponent', () => {
  let component: AllowanceCreateComponent;
  let fixture: ComponentFixture<AllowanceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowanceCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllowanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
