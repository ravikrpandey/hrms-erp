import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyKtRequest } from './my-kt-request';

describe('MyKtRequest', () => {
  let component: MyKtRequest;
  let fixture: ComponentFixture<MyKtRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyKtRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyKtRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
