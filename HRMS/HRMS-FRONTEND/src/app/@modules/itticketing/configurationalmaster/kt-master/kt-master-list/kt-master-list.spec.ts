import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtMasterList } from './kt-master-list';

describe('KtMasterList', () => {
  let component: KtMasterList;
  let fixture: ComponentFixture<KtMasterList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtMasterList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtMasterList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
