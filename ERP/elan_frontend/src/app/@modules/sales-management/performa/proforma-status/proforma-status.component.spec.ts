import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaStatusComponent } from './proforma-status.component';

describe('ProformaStatusComponent', () => {
  let component: ProformaStatusComponent;
  let fixture: ComponentFixture<ProformaStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
