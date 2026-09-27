import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterMasterComponent } from './transporter-master.component';

describe('TransporterMasterComponent', () => {
  let component: TransporterMasterComponent;
  let fixture: ComponentFixture<TransporterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransporterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
