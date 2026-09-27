import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtMasterAction } from './kt-master-action';

describe('KtMasterAction', () => {
  let component: KtMasterAction;
  let fixture: ComponentFixture<KtMasterAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtMasterAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtMasterAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
