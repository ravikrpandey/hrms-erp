import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortMasterActionComponent } from './port-master-action.component';

describe('PortMasterActionComponent', () => {
  let component: PortMasterActionComponent;
  let fixture: ComponentFixture<PortMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
