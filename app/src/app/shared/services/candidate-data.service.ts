import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Observable } from 'rxjs';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';

@Injectable({
  providedIn: 'root',
})
export class CandidateDataService {
  constructor() {}
  private _dataSource: MatTableDataSource<CandidateResponse>;

  private candidateId: number;
  private jobId: number;

  private keywords: string[];
  private jobKeywords: string[];
  private stageKeywords: string[];

  private filters: any;
  private jobFilters: any;
  private stageFilters: any;

  private dataSourceSubject: Subject<MatTableDataSource<CandidateResponse>> =
    new Subject<MatTableDataSource<CandidateResponse>>();

  public get dataSource(): MatTableDataSource<CandidateResponse> {
    return this._dataSource;
  }

  public set dataSource(value: MatTableDataSource<CandidateResponse>) {
    this._dataSource = value;

    this.dataSourceSubject.next(value);
  }

  public get dataSourceChanges(): Observable<
    MatTableDataSource<CandidateResponse>
  > {
    return this.dataSourceSubject.asObservable();
  }

  setJob(id: number) {
    this.jobId = id;
  }

  getJob() {
    return this.jobId;
  }

  setCandidates(id: number) {
    this.candidateId = id;
    localStorage.setItem('candidateId', JSON.stringify(this.candidateId));
  }

  getCandidates() {
    return JSON.parse(localStorage.getItem('candidateId')!);
  }

  setKeywords(keywords: any) {
    this.keywords = keywords;
  }

  getKeywords() {
    return this.keywords;
  }

  setFilters(filters: any) {
    this.filters = filters;
    
  }

  getFilters() {
    return this.filters;
  }

  setJobFilters(filters: any) {
    this.jobFilters = filters;
  }

  getJobFilters() {
    return this.jobFilters;
  }
  
  setStageFilters(filters: any) {
    this.stageFilters = filters;
    
  }

  getStageFilters() {
    return this.stageFilters;
  }
}
