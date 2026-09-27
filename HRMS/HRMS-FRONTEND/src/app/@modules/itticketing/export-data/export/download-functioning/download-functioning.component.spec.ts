import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFunctioningComponent } from './download-functioning.component';

describe('DownloadFunctioningComponent', () => {
  let component: DownloadFunctioningComponent;
  let fixture: ComponentFixture<DownloadFunctioningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFunctioningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFunctioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
