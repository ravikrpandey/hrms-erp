import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncotermMasterFormComponent } from './incoterm-master-form.component';

describe('IncotermMasterFormComponent', () => {
  let component: IncotermMasterFormComponent;
  let fixture: ComponentFixture<IncotermMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncotermMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncotermMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
