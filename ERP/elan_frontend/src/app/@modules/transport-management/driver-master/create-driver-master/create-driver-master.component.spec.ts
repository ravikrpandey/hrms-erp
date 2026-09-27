import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDriverMasterComponent } from './create-driver-master.component';

describe('CreateDriverMasterComponent', () => {
  let component: CreateDriverMasterComponent;
  let fixture: ComponentFixture<CreateDriverMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDriverMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDriverMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
