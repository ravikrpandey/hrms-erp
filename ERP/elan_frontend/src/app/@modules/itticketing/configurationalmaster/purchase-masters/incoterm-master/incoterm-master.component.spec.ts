import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermMasterComponent } from './incoterm-master.component';

describe('IncotermMasterComponent', () => {
  let component: IncotermMasterComponent;
  let fixture: ComponentFixture<IncotermMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncotermMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncotermMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
