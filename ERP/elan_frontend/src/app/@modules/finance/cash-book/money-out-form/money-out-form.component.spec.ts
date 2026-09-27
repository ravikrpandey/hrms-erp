import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyOutFormComponent } from './money-out-form.component';

describe('MoneyOutFormComponent', () => {
  let component: MoneyOutFormComponent;
  let fixture: ComponentFixture<MoneyOutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyOutFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyOutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
