import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfitCenterComponent } from './add-profit-center.component';

describe('AddProfitCenterComponent', () => {
  let component: AddProfitCenterComponent;
  let fixture: ComponentFixture<AddProfitCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProfitCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfitCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
