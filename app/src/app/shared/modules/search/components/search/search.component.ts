import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { FakeDataService } from '../../../../services/fake-data.service';
import { CandidateDataService } from '../../../../services/candidate-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  candidates: CandidateResponse[];
  numSelected: number;
  numRows: number;
  selectedRows: number[] = [];
  dataSource: any;
  isDeleted: boolean = false;
  isDeleteClicked: boolean = false;
  popup: boolean = false;
  experienceValue: number = 0;
  showMoreCities: boolean = false;
  allCities: any = [];
  selectedCities: string[] = [];
  checkedCities: boolean[] = [];

  jobId: number | null;

  key: number | null;

  length: number;
  pageSize: number = 10;
  pageIndex: number = 0;

  salary = false;
  experience = false;
  location = false;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  keywords: string[] = [];

  salaryFrom: string;
  salaryTo: string;
  isLoading: boolean;

  filterNumber: number;

  constructor(
    private candidateService: CandidateService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private candidateDataService: CandidateDataService,
    private snackbar: MatSnackBar,
    private fakeDataService: FakeDataService
  ) {
    
  }

  ngOnInit() {
    this.jobId = this.candidateDataService.getJob();

    this.route.params?.subscribe((params) => {
      params['key'] ? (this.key = Number(params['key'])) : null;
    });

    if (this.route.snapshot.queryParams) {
      this.route.queryParams.subscribe((params) => {
        const filters = new URLSearchParams(params['filters']);

        const filtersMap: { [key: string]: string } = {};

        filters.forEach((value, key) => {
          filtersMap[key] = value;
        });

        if (
          filtersMap.experience === "0"
        ) {
          this.filterNumber = Object.keys(filtersMap).length - 1;
        } else {
          this.filterNumber = Object.keys(filtersMap).length;
        }
      });

      if (this.jobId) {
        this.route.queryParams.subscribe((params) => {
          let urlKeywords: string[] = [];
          if (params['keywords']) {
            if (Array.isArray(params['keywords'])) {
              urlKeywords = params['keywords'];
            } else {
              urlKeywords = [params['keywords']];
            }

            this.candidateDataService.setKeywords(urlKeywords);
            this.candidateService
              .getCandidateByJobAndKeywords(
                this.jobId!,
                urlKeywords,
                this.pageIndex,
                this.pageSize
              )
              .subscribe(
                (data) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    data
                  );
                  this.candidates = data;

                  this.length = data.length;
                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          } else if (params['filters']) {
            const filters = new URLSearchParams(params['filters']);

            this.candidateDataService.setJobFilters(filters);
            this.candidateService
              .getCandidateByJobAndFilters(
                this.jobId!,
                filters,
                this.pageIndex,
                this.pageSize
              )
              .subscribe(
                (data: any) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    data.content
                  );
                  this.candidates = data.content;

                  this.length = data.numberOfElements;
                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          } else {
            this.candidateService
              .getCandidateByJobAndKeywords(
                this.jobId!,
                [],
                this.pageIndex,
                this.pageSize
              )
              .subscribe(
                (data) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    data
                  );
                  this.candidates = data;

                  this.fetchCities();

                  this.length = data.length;
                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          }
        });
      } else if (this.key) {
        this.route.queryParams.subscribe((params) => {
          let urlKeywords: string[] = [];
          if (params['keywords']) {
            if (Array.isArray(params['keywords'])) {
              urlKeywords = params['keywords'];
            } else {
              urlKeywords = [params['keywords']];
            }

            this.candidateDataService.setKeywords(urlKeywords);

            this.candidateService
              .getCandidatesWithStageAndKeywords(
                this.key!,
                urlKeywords,
                this.pageIndex,
                this.pageSize
              )
              .subscribe(
                (data: CandidateResponse[]) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    data
                  );
                  this.candidates = data;

                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          } else if (params['filters']) {
            const filters = new URLSearchParams(params['filters']);

            this.candidateDataService.setStageFilters(filters);

            this.candidateService
              .getCandidatesWithStageAndFilters(
                this.key!,
                this.pageIndex,
                this.pageSize,
                filters
              )
              .subscribe(
                (response) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    response.content
                  );

                  this.length = response.size;
                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          } else {
            this.candidateService
              .getCandidatesWithStageAndKeywords(
                this.key!,
                [],
                this.pageIndex,
                this.pageSize
              )
              .subscribe(
                (data: CandidateResponse[]) => {
                  this.dataSource = new MatTableDataSource<CandidateResponse>(
                    data
                  );
                  this.candidates = data;

                  this.candidateDataService.dataSource = this.dataSource;
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    this.snackbar.open('Candidate not found', 'Close', {
                      duration: 2000,
                    });
                  } else if (error.status === 500) {
                    this.snackbar.open('Error on server side', 'Close', {
                      duration: 2000,
                    });
                  } else {
                    this.snackbar.open(
                      `Failed to fetch candidates. Error code: ${error.status}`,
                      'Close',
                      {
                        duration: 2000,
                      }
                    );
                  }
                }
              );
          }
        });
      } else {
        this.route.queryParams.subscribe((params) => {
          let urlKeywords: string[] = [];
          if (params['keywords']) {
            if (Array.isArray(params['keywords'])) {
              urlKeywords = params['keywords'];
            } else {
              urlKeywords = [params['keywords']];
            }

            this.candidateDataService.setKeywords(urlKeywords);

            let searchKeywords = urlKeywords.join(',');
            const url = `/candidates/search?keywords=${searchKeywords}&page=${this.pageIndex}&size=${this.pageSize}&sort=id,asc`;
            this.http.get<CandidateResponse[]>(url).subscribe(
              (data) => {
                this.dataSource = new MatTableDataSource<CandidateResponse>(
                  data
                );
                this.length = data.length;
                this.candidates = data;

                this.candidateDataService.dataSource = this.dataSource;
              },
              (error: HttpErrorResponse) => {
                if (error.status === 404) {
                  this.snackbar.open('Candidate not found', 'Close', {
                    duration: 2000,
                  });
                } else if (error.status === 500) {
                  this.snackbar.open('Error on server side', 'Close', {
                    duration: 2000,
                  });
                } else {
                  this.snackbar.open(
                    `Failed to fetch candidates. Error code: ${error.status}`,
                    'Close',
                    {
                      duration: 2000,
                    }
                  );
                }
              }
            );
          } else if (params['filters']) {
            const filters = new URLSearchParams(params['filters']);
            const filtersMap: { [key: string]: string } = {};

            filters.forEach((value, key) => {
              filtersMap[key] = value;
            });

            const location =
              filtersMap.location === undefined ? '' : filtersMap.location;
            const minCurrentCTC = isNaN(Number(filtersMap.minCurrentCTC))
              ? 0
              : Number(filtersMap.minCurrentCTC);
            const maxCurrentCTC = isNaN(Number(filtersMap.maxCurrentCTC))
              ? 100
              : Number(filtersMap.maxCurrentCTC);
            const totalExperience = isNaN(Number(filtersMap.experience))
              ? 0
              : Number(filtersMap.experience);

            const url = `/candidates/filter?location=${location}&minCurrentCTC=${minCurrentCTC}&maxCurrentCTC=${maxCurrentCTC}&totalExperience=${totalExperience}`;

            this.candidateDataService.setFilters(filtersMap);

            this.http.get<CandidateResponse[]>(url).subscribe((data) => {
              this.dataSource = new MatTableDataSource<CandidateResponse>(data);
              this.length = data.length;
              this.candidates = data;
              this.candidateDataService.dataSource = this.dataSource;
            });
          } else {
            const url = `/candidates/search?keywords=&page=${this.pageIndex}&size=${this.pageSize}&sort=id,asc`;
            this.http.get<CandidateResponse[]>(url).subscribe(
              (data) => {
                this.dataSource = new MatTableDataSource<CandidateResponse>(
                  data
                );
                
                this.length = data.length;
                this.candidates = data;
                this.fetchCities();

                this.candidateDataService.dataSource = this.dataSource;
              },
              (error: HttpErrorResponse) => {
                if (error.status === 404) {
                  this.snackbar.open('Candidate not found', 'Close', {
                    duration: 2000,
                  });
                } else if (error.status === 500) {
                  this.snackbar.open('Error on server side', 'Close', {
                    duration: 2000,
                  });
                } else {
                  this.snackbar.open(
                    `Failed to fetch candidates. Error code: ${error.status}`,
                    'Close',
                    {
                      duration: 2000,
                    }
                  );
                }
              }
            );
          }
        });
      }
    } else {
      if (this.jobId) {
        this.fetchCandidatesByJob();
      } else {
        this.fetchCandidates();
      }
    }
  }

  fetchCities(): any {
    if (!this.allCities) {
      this.allCities = [];
    }

    const existingCitiesSet = new Set(this.allCities);

    // Map and add only the new cities to the allCities array
    this.allCities = this.allCities.concat(
      this.candidates
        .map((candidate) => candidate.address.currentAddress.currentCity)
        .filter((city) => !existingCitiesSet.has(city))
    );
  }

  // Function to add a keyword
  // ...

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Check the length of the entered keyword
    if (value.length <= 20) {
      if ((value || '').trim()) {
        this.keywords.push(value.trim());
      }
    } else {
      this.snackbar.open('Keyword should not exceed 30 characters', 'Close', {
        duration: 2000,
      });
    }

    // Clear the input value
    if (input) {
      input.value = '';
    }
  }

  // Function to remove a keyword
  remove(keyword: string): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }

    if (this.keywords.length === 0) {
      if (this.jobId) {
        this.fetchCandidatesByJob();
      } else {
        this.fetchCandidates();
      }
    }
  }

  fetchCandidates(
    columnName: string = 'id',
    sortDirection: string = 'asc'
  ): void {
    this.isLoading = true;

    this.candidateService
      .getCandidates(this.pageIndex, this.pageSize, columnName, sortDirection)
      .subscribe(
        (response: CandidateResponse[]) => {
          this.candidates = response;

          this.dataSource = new MatTableDataSource<CandidateResponse>(
            this.candidates
          );

          this.fetchCities();

          this.isLoading = false;
          this.candidateDataService.dataSource = this.dataSource;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackbar.open('Candidate not found', 'Close', {
              duration: 2000,
            });
          } else if (error.status === 500) {
            this.snackbar.open('Error on server side', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackbar.open(
              `Failed to fetch candidates. Error code: ${error.status}`,
              'Close',
              {
                duration: 2000,
              }
            );
          }
          this.isLoading = false;
        }
      );
  }

  fetchCandidatesByJob(
    columnName: string = 'id',
    sortDirection: string = 'asc'
  ): void {
    this.isLoading = true;
    this.candidateService
      .getCandidatesByJobPosition(
        this.jobId!,
        this.pageIndex,
        this.pageSize,
        columnName,
        sortDirection
      )
      .subscribe(
        (response: CandidateResponse[]) => {
          this.candidates = response;

          this.dataSource = new MatTableDataSource<CandidateResponse>(
            this.candidates
          );

          this.fetchCities();

          this.isLoading = false;
          this.candidateDataService.dataSource = this.dataSource;
        },
        (error) => {
          alert(error);
          this.isLoading = false;
        }
      );
  }

  onCheckboxChange(city: any, index: number) {
    this.checkedCities[index] = !this.checkedCities[index];

    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter((c) => c !== city);
    } else {
      this.selectedCities.push(city);
    }
  }

  // Function to apply search
  applySearch() {
    const keywords = this.keywords.map((keyword) =>
      keyword.trim().toLowerCase()
    );

    if (this.jobId) {
      this.candidateService
        .getCandidateByJobAndKeywords(
          this.jobId,
          keywords,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (data) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(data);
            this.length = data.length;
            this.candidateDataService.dataSource = this.dataSource;

            this.router.navigate(
              [`interview/jobs/${this.jobId}/candidates/search`],
              {
                queryParams: { keywords: keywords },
              }
            );
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackbar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackbar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            } else {
              this.snackbar.open(
                `Failed to fetch candidates. Error code: ${error.status}`,
                'Close',
                {
                  duration: 2000,
                }
              );
            }
          }
        );
    } else if (this.key) {
      this.candidateService
        .getCandidatesWithStageAndKeywords(
          this.key,
          keywords,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (data: CandidateResponse[]) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(data);

            this.candidateDataService.dataSource = this.dataSource;

            this.router.navigate([`/dashboard/${this.key}/search`], {
              queryParams: { keywords: keywords },
            });
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackbar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackbar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            } else {
              this.snackbar.open(
                `Failed to fetch candidates. Error code: ${error.status}`,
                'Close',
                {
                  duration: 2000,
                }
              );
            }
          }
        );
    } else {
      const searchKeywords = keywords.join(',');
      const url = `/candidates/search?keywords=${searchKeywords}`;
      this.http.get<CandidateResponse[]>(url).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<CandidateResponse>(data);
          this.length = data.length;
          this.candidateDataService.dataSource = this.dataSource;

          this.router.navigate(['/candidate-pool/all-candidates/search'], {
            queryParams: { keywords: searchKeywords },
          });
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackbar.open('Candidate not found', 'Close', {
              duration: 2000,
            });
          } else if (error.status === 500) {
            this.snackbar.open('Error on server side', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackbar.open(
              `Failed to fetch candidates. Error code: ${error.status}`,
              'Close',
              {
                duration: 2000,
              }
            );
          }
        }
      );
    }
  }

  applyAllFilters(): any {
    if (!this.candidates) {
      return;
    }

    const previouslySelectedCities = [...this.selectedCities];

    const params = new URLSearchParams();

    if (this.salaryFrom) {
      params.append('minCtc', this.salaryFrom);
    }
    if (this.salaryTo) {
      params.append('maxCtc', this.salaryTo);
    }
    if (this.experienceValue !== undefined) {
      params.append('experience', this.experienceValue.toString());
    }

    if (this.selectedCities?.length > 0) {
      this.selectedCities.forEach((location) =>
        params.append('location', location)
      );
    }

    if (this.jobId) {
      this.candidateService
        .getCandidateByJobAndFilters(
          this.jobId,
          params,
          this.pageIndex,
          this.pageSize,
          'id',
          'asc'
        )
        .subscribe(
          (response) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(
              response
            );
            this.length = response.length;
            this.candidateDataService.dataSource = this.dataSource;
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackbar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackbar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            }
          }
        );

      this.router.navigate([`interview/jobs/${this.jobId}/candidates/search`], {
        queryParams: { filters: params },
      });
    } else if (this.key) {
      this.candidateService
        .getCandidatesWithStageAndFilters(
          this.key,
          this.pageIndex,
          this.pageSize,
          params
        )
        .subscribe(
          (response) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(
              response.content
            );

            this.length = response.size;
            this.candidateDataService.dataSource = this.dataSource;
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackbar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackbar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            } else {
              this.snackbar.open(
                `Failed to fetch candidates. Error code: ${error.status}`,
                'Close',
                {
                  duration: 2000,
                }
              );
            }
          }
        );

      this.router.navigate([`/dashboard/${this.key}/search`], {
        queryParams: { filters: params },
      });
    } else {
      const url = `/candidates/filter?${params.toString()}`;

      this.http.get<CandidateResponse[]>(url).subscribe(
        (data) => {
          this.dataSource = new MatTableDataSource<CandidateResponse>(data);
          this.length = data.length;

          this.candidateDataService.dataSource = this.dataSource;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackbar.open('Candidate not found', 'Close', {
              duration: 2000,
            });
          } else if (error.status === 500) {
            this.snackbar.open('Error on server side', 'Close', {
              duration: 2000,
            });
          } else {
            this.snackbar.open(
              `Failed to fetch candidates. Error code: ${error.status}`,
              'Close',
              {
                duration: 2000,
              }
            );
          }
        }
      );

      this.router.navigate([`/candidate-pool/all-candidates/search`], {
        queryParams: { filters: params },
      });
    }

    this.allCities.forEach((city: string) => {
      if (previouslySelectedCities.includes(city)) {
        this.checkedCities[this.allCities.indexOf(city)] = true;
      } else {
        this.checkedCities[this.allCities.indexOf(city)] = false;
      }
    });

    this.popup = false;
  }

  resetFilter() {
    // Set the filter values back to their default values
    this.salaryFrom = '';
    this.salaryTo = '';
    this.experienceValue = 0;
    this.selectedCities = [];
    this.checkedCities = [];

    if (this.jobId) {
      this.fetchCandidatesByJob();
    } else {
      this.fetchCandidates();
    }
    // this.fetchCandidates();

    this.candidateDataService.dataSource = this.dataSource;

    this.showMoreCities = false;
  }

  formatLabel(value: number): string {
    this.experienceValue = value;

    return value + 'y';
  }

  // Function to generate data
  generateData(count: number) {
    setTimeout(() => {
      this.fakeDataService.generateFakeCandidates(count);
    }, 800);
  }
}
