import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatemasterdialogComponent } from './statemasterdialog.component';

describe('StatemasterdialogComponent', () => {
  let component: StatemasterdialogComponent;
  let fixture: ComponentFixture<StatemasterdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatemasterdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatemasterdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
