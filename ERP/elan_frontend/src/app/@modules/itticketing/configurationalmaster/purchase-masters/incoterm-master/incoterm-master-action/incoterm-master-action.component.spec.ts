import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermMasterActionComponent } from './incoterm-master-action.component';

describe('IncotermMasterActionComponent', () => {
  let component: IncotermMasterActionComponent;
  let fixture: ComponentFixture<IncotermMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncotermMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncotermMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
