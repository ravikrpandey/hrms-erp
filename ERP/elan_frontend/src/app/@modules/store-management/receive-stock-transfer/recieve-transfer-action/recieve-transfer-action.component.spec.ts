import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveTransferActionComponent } from './recieve-transfer-action.component';

describe('RecieveTransferActionComponent', () => {
  let component: RecieveTransferActionComponent;
  let fixture: ComponentFixture<RecieveTransferActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecieveTransferActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieveTransferActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
