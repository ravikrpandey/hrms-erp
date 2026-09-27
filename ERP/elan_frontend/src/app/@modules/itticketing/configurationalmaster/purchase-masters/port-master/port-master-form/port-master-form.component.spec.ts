import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortMasterFormComponent } from './port-master-form.component';

describe('PortMasterFormComponent', () => {
  let component: PortMasterFormComponent;
  let fixture: ComponentFixture<PortMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
