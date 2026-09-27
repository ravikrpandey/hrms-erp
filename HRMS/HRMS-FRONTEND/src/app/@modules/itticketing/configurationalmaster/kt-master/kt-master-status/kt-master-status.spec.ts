import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtMasterStatus } from './kt-master-status';

describe('KtMasterStatus', () => {
  let component: KtMasterStatus;
  let fixture: ComponentFixture<KtMasterStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtMasterStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtMasterStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
