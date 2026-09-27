import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrymasterdialogComponent } from './countrymasterdialog.component';

describe('CountrymasterdialogComponent', () => {
  let component: CountrymasterdialogComponent;
  let fixture: ComponentFixture<CountrymasterdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountrymasterdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountrymasterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
