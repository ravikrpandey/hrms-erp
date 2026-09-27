import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsRegisterComponent } from './tds-register.component';

describe('TdsRegisterComponent', () => {
  let component: TdsRegisterComponent;
  let fixture: ComponentFixture<TdsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TdsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
