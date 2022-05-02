import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDocumentComponent } from './detail-document.component';

describe('DetailDocumentComponent', () => {
  let component: DetailDocumentComponent;
  let fixture: ComponentFixture<DetailDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
