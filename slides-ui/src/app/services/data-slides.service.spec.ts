import { TestBed, inject } from '@angular/core/testing';

import { DataSlidesService } from './data-slides.service';

describe('DataSlidesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataSlidesService]
    });
  });

  it('should be created', inject([DataSlidesService], (service: DataSlidesService) => {
    expect(service).toBeTruthy();
  }));
});
