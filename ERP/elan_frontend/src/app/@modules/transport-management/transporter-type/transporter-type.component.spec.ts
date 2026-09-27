import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterTypeComponent } from './transporter-type.component';

describe('TransporterTypeComponent', () => {
  let component: TransporterTypeComponent;
  let fixture: ComponentFixture<TransporterTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
