import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsDownloadComponent } from './reports-download.component';

describe('ReportsDownloadComponent', () => {
  let component: ReportsDownloadComponent;
  let fixture: ComponentFixture<ReportsDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
