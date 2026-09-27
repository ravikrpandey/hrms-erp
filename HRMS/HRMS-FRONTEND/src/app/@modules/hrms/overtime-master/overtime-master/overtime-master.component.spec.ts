import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeMasterComponent } from './overtime-master.component';

describe('OvertimeMasterComponent', () => {
  let component: OvertimeMasterComponent;
  let fixture: ComponentFixture<OvertimeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvertimeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
