import { TestBed, inject } from '@angular/core/testing';

import { DataFoldersService } from './data-folders.service';

describe('DataFoldersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataFoldersService]
    });
  });

  it('should be created', inject([DataFoldersService], (service: DataFoldersService) => {
    expect(service).toBeTruthy();
  }));
});
