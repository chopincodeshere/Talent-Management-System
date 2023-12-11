package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.tecunique.tms.dto.CandidateDetailsDto;
import com.tecunique.tms.entity.*;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.CandidateFeedbackRepository;
import com.tecunique.tms.services.CandidateService;
import com.tecunique.tms.services.JobPositionService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
class CandidateControllerTest {
  @Mock private CandidateService candidateService;

  @Mock private JobPositionService jobPositionService;

  @Mock private CandidateFeedbackRepository candidateFeedbackRepository;

  @InjectMocks private CandidateController candidateController;

  private MultipartFile createMockPdfFile() {
    byte[] content = {};
    return new MockMultipartFile("pdfFile", "file.pdf", "application/pdf", content);
  }

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void getTotalNumberOfRecords() {
    Long expectedCount = 10L;
    when(candidateService.getTotalNumberOfRecords()).thenReturn(expectedCount);

    ResponseEntity<Long> response = candidateController.getTotalNumberOfRecords();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
  }

  @Test
  void getAllCandidatesDto() {
    int pageNumber = 0;
    int pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";
    List<CandidateDetailsDto> candidates = Collections.singletonList(new CandidateDetailsDto());

    when(candidateService.getAllCandidates(pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenReturn(candidates);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getAllCandidatesDto(pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidates, response.getBody());
    verify(candidateService, times(1))
        .getAllCandidates(pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  @Test
  void getAllCandidatesDto_WhenListIsEmpty() {
    int pageNumber = 0;
    int pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    when(candidateService.getAllCandidates(pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenReturn(Collections.emptyList());

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getAllCandidatesDto(pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    assertTrue(response.getBody() == null || response.getBody().isEmpty()); // Check for
    verify(candidateService, times(1))
        .getAllCandidates(pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  @Test
  void searchCandidates() {
    String[] keywords = {"keyword1", "keyword2"};
    int pageNumber = 0;
    int pageSize = 10;
    List<CandidateDetailsDto> candidates = Collections.singletonList(new CandidateDetailsDto());

    when(candidateService.searchCandidates(keywords, pageNumber, pageSize)).thenReturn(candidates);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidates(keywords, pageNumber, pageSize);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidates, response.getBody());
    verify(candidateService, times(1)).searchCandidates(keywords, pageNumber, pageSize);
  }

  @Test
  public void searchCandidates_ExceptionThrown_ReturnsInternalServerError() {
    String[] keywords = {"keyword1", "keyword2"};
    int pageNumber = 0;
    int pageSize = 10;

    when(candidateService.searchCandidates(any(String[].class), anyInt(), anyInt()))
        .thenThrow(new RuntimeException("Internal Server Error"));

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidates(keywords, pageNumber, pageSize);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    assertNull(response.getBody());
  }

  @Test
  void searchCandidatesByKeywordAndJobId() {
    String[] keywords = {"keyword1", "keyword2"};
    Long jobId = 12L;
    int page = 0;
    int size = 10;

    List<CandidateDetailsDto> candidates = Collections.singletonList(new CandidateDetailsDto());

    when(candidateService.findByKeywordAndJobId(keywords, jobId, page, size))
        .thenReturn(candidates);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidatesByKeywordAndJobId(keywords, jobId, page, size);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidates, response.getBody());
    verify(candidateService, times(1)).findByKeywordAndJobId(keywords, jobId, page, size);
  }

  @Test
  void searchCandidatesByCurrentCTCAndLocationAndTotalExperience() {
    String[] location = {"city1", "city2"};
    Integer minCurrentCTC = 50000;
    Integer maxCurrentCTC = 100000;
    Integer totalExperience = 5;
    int page = 0;
    int size = 10;

    Page<CandidateDetailsDto> candidatesPage =
        new PageImpl<>(Collections.singletonList(new CandidateDetailsDto()));

    when(candidateService.findCandidatesByLocationAndCtcAndExperience(
            location, minCurrentCTC, maxCurrentCTC, totalExperience, page, size))
        .thenReturn(candidatesPage);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidatesByCurrentCTCAndLocationAndTotalExperience(
            location, minCurrentCTC, maxCurrentCTC, totalExperience, page, size);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidatesPage.getContent(), response.getBody());
    verify(candidateService, times(1))
        .findCandidatesByLocationAndCtcAndExperience(
            location, minCurrentCTC, maxCurrentCTC, totalExperience, page, size);
  }

  @Test
  void findCandidatesByFilters() {
    int minCTC = 5;
    int maxCTC = 10;
    String[] location = new String[] {"New York"};
    int experience = 5;
    Long jobId = 1L;

    JobPosition jobPosition = new JobPosition();
    when(jobPositionService.getJobPositionById(jobId)).thenReturn(jobPosition);

    Page<CandidateDetailsDto> candidatesPage =
        new PageImpl<>(Arrays.asList(new CandidateDetailsDto(), new CandidateDetailsDto()));
    when(candidateService.findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
            location,
            minCTC,
            maxCTC,
            experience,
            jobPosition,
            PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id"))))
        .thenReturn(candidatesPage);

    ResponseEntity<Page<CandidateDetailsDto>> result =
        candidateController.findCandidatesByFilters(
            location, minCTC, maxCTC, experience, jobId, 0, 10, "id", "asc");

    assertEquals(candidatesPage, result.getBody());
    verify(candidateService, times(1))
        .findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
            location,
            minCTC,
            maxCTC,
            experience,
            jobPosition,
            PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id")));
  }

  @Test
  void findCandidatesByFilters_WithNoFilters() {
    Long jobId = 1L;

    JobPosition jobPosition = new JobPosition();
    when(jobPositionService.getJobPositionById(jobId)).thenReturn(jobPosition);

    Page<CandidateDetailsDto> candidatesPage =
        new PageImpl<>(Arrays.asList(new CandidateDetailsDto(), new CandidateDetailsDto()));
    when(candidateService.findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
            null,
            null,
            null,
            null,
            jobPosition,
            PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id"))))
        .thenReturn(candidatesPage);

    ResponseEntity<Page<CandidateDetailsDto>> result =
        candidateController.findCandidatesByFilters(
            null, null, null, null, jobId, 0, 10, "id", "asc");

    assertEquals(candidatesPage, result.getBody());
    verify(candidateService, times(1))
        .findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
            null,
            null,
            null,
            null,
            jobPosition,
            PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "id")));
  }

  @Test
  void getCandidatesByJobId() throws Exception {
    Long jobId = 1L;
    Integer pageNumber = 0;
    Integer pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    JobPosition jobPosition = new JobPosition();
    when(jobPositionService.getJobPositionById(jobId)).thenReturn(jobPosition);

    List<CandidateDetailsDto> candidates =
        Arrays.asList(new CandidateDetailsDto(), new CandidateDetailsDto());

    when(candidateService.getCandidatesByJobPosition(
            jobPosition, pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenReturn(candidates);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getCandidatesByJobId(jobId, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidates, response.getBody());
    verify(jobPositionService, times(1)).getJobPositionById(jobId);
    verify(candidateService, times(1))
        .getCandidatesByJobPosition(
            jobPosition, pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  @Test
  void getCandidatesByJobId_WithInvalidJob() throws Exception {
    Long jobId = 1L;
    Integer pageNumber = 0;
    Integer pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    when(jobPositionService.getJobPositionById(jobId)).thenReturn(null);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getCandidatesByJobId(jobId, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertNull(response.getBody());
    verify(jobPositionService, times(1)).getJobPositionById(jobId);
    verify(candidateService, never())
        .getCandidatesByJobPosition(
            any(JobPosition.class), anyInt(), anyInt(), anyString(), any(Sort.Direction.class));
  }

  @Test
  void getCountOfJob() {
    Long jobId = 1L;
    Long count = 10L;

    when(candidateService.getNumberOfCandidatesByJobId(jobId)).thenReturn(count);

    ResponseEntity<Long> response = candidateController.getCountOfJob(jobId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfCandidatesByJobId(jobId);
  }

  @Test
  void getCountOfJob_ExceptionThrown() {
    Long jobId = 1L;

    when(candidateService.getNumberOfCandidatesByJobId(jobId)).thenThrow(RuntimeException.class);

    ResponseEntity<Long> response = candidateController.getCountOfJob(jobId);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    assertEquals(null, response.getBody());
    // assertNull(response.getBody());
    verify(candidateService, times(1)).getNumberOfCandidatesByJobId(jobId);
  }

  @Test
  void getCandidateName() {
    Long candidateId = 1L;
    String candidateName = "Neel Javia";

    when(candidateService.getCandidateByName(candidateId)).thenReturn(candidateName);

    ResponseEntity<String> response = candidateController.getCandidateName(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidateName, response.getBody());
    verify(candidateService, times(1)).getCandidateByName(candidateId);
  }

  @Test
  void getCandidateName_ExceptionThrown() {
    Long candidateId = 1L;

    when(candidateService.getCandidateByName(candidateId)).thenThrow(RuntimeException.class);

    ResponseEntity<String> response = candidateController.getCandidateName(candidateId);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    assertEquals(null, response.getBody());
    verify(candidateService, times(1)).getCandidateByName(candidateId);
  }

  @Test
  void getCandidatePosition() {
    Long candidateId = 1L;
    Long candidatePosition = 2L;

    when(candidateService.getCandidateByPosition(candidateId)).thenReturn(candidatePosition);

    ResponseEntity<Long> response = candidateController.getCandidatePosition(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidatePosition, response.getBody());
    verify(candidateService, times(1)).getCandidateByPosition(candidateId);
  }

  @Test
  void getCandidatePosition_ExceptionThrown() {
    Long candidateId = 1L;

    when(candidateService.getCandidateByPosition(candidateId)).thenThrow(RuntimeException.class);

    ResponseEntity<Long> response = candidateController.getCandidatePosition(candidateId);

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertEquals(null, response.getBody());
    verify(candidateService, times(1)).getCandidateByPosition(candidateId);
  }

  @Test
  void getCandidateById() {
    Long candidateId = 1L;
    Candidates expectedCandidate = new Candidates();
    expectedCandidate.setId(candidateId);

    when(candidateService.getCandidateById(candidateId)).thenReturn(expectedCandidate);

    ResponseEntity<Candidates> response = candidateController.getCandidateById(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(expectedCandidate, response.getBody());
    verify(candidateService, times(1)).getCandidateById(candidateId);
  }

  @Test
  void addCandidate() {
    Candidates candidate = new Candidates();
    candidate.setId(1L);
    candidate.setFirstName("Neel");

    MultipartFile pdfFile = createMockPdfFile();

    when(candidateService.addCandidate(any(Candidates.class))).thenReturn(candidate);

    ResponseEntity<Candidates> response = candidateController.addCandidate(pdfFile, candidate);

    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    assertEquals(candidate, response.getBody());
    verify(candidateService, times(1)).addCandidate(candidate);
  }

  @Test
  void addCandidateFeedback() {
    Long candidateId = 1L;
    CandidateFeedback candidateFeedback = new CandidateFeedback();
    CandidateFeedback savedFeedback = new CandidateFeedback();

    when(candidateService.addCandidateFeedback(candidateId, candidateFeedback))
        .thenReturn(savedFeedback);

    ResponseEntity<CandidateFeedback> response =
        candidateController.addCandidateFeedback(candidateId, candidateFeedback);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(savedFeedback, response.getBody());
    verify(candidateService, times(1)).addCandidateFeedback(candidateId, candidateFeedback);
  }

  @Test
  void updateCandidateNote() {
    Long candidateId = 1L;
    String note = "New note";

    ResponseEntity<Void> response = candidateController.updateCandidateNote(candidateId, note);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    verify(candidateService, times(1)).addInterviewerNote(candidateId, note);
  }

  @Test
  void updateCandidateRound() {
    Long candidateId = 1L;
    Integer round = 2;

    ResponseEntity<Void> response = candidateController.updateCandidateRound(candidateId, round);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    verify(candidateService, times(1)).updateRound(candidateId, round);
  }

  @Test
  void deleteCandidate() {
    Long candidateId = 1L;

    ResponseEntity<?> response = candidateController.deleteCandidate(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    verify(candidateService, times(1)).deleteCandidate(candidateId);
  }

  @Test
  void deleteCandidate_ThrowsException() {
    Long candidateId = 1L;

    doAnswer(
            (Answer<Void>)
                invocation -> {
                  throw new Exception("Some exception");
                })
        .when(candidateService)
        .deleteCandidate(candidateId);
    ResponseEntity<?> response = candidateController.deleteCandidate(candidateId);

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    verify(candidateService, times(1)).deleteCandidate(candidateId);
  }

  @Test
  void updateCandidate() {
    Long candidateId = 1L;
    Candidates candidateDetails = new Candidates();
    Candidates updatedCandidate = new Candidates();

    when(candidateService.updateCandidate(candidateId, candidateDetails))
        .thenReturn(updatedCandidate);

    ResponseEntity<Candidates> response =
        candidateController.updateCandidate(candidateId, updatedCandidate);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(updatedCandidate, response.getBody());
    verify(candidateService, times(1)).updateCandidate(candidateId, updatedCandidate);
  }

  @Test
  void updateCandidate_NotFound() {
    Long candidateId = 1L;
    Candidates candidateDetails = new Candidates();

    when(candidateService.updateCandidate(candidateId, candidateDetails))
        .thenThrow(ResourceNotFoundException.class);

    ResponseEntity<Candidates> response =
        candidateController.updateCandidate(candidateId, candidateDetails);

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    verify(candidateService, times(1)).updateCandidate(candidateId, candidateDetails);
  }

  @Test
  void updateCandidate_InternalServerError() {
    Long candidateId = 1L;
    Candidates candidateDetails = new Candidates();

    when(candidateService.updateCandidate(eq(candidateId), eq(candidateDetails)))
        .thenAnswer(
            invocation -> {
              throw new Exception("Internal Sever Error");
            });

    ResponseEntity<Candidates> response =
        candidateController.updateCandidate(candidateId, candidateDetails);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    verify(candidateService, times(1)).updateCandidate(candidateId, candidateDetails);
  }

  @Test
  void getNumberOfShortlistedCandidates() {
    int count = 5;
    when(candidateService.getNumberOfShortlistedCandidates()).thenReturn(count);

    ResponseEntity<Integer> response = candidateController.getNumberOfShortlistedCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfShortlistedCandidates();
  }

  @Test
  void getNumberOfShortlistedCandidatesException() {
    when(candidateService.getNumberOfShortlistedCandidates())
        .thenThrow(new RuntimeException("Error"));

    try {
      candidateController.getNumberOfShortlistedCandidates();
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
      assertEquals("Error", e.getMessage());
    }

    verify(candidateService, times(1)).getNumberOfShortlistedCandidates();
  }

  @Test
  void getNumberOfHiredCandidates() {
    int count = 10;
    when(candidateService.getNumberOfHiredCandidates()).thenReturn(count);

    ResponseEntity<Integer> response = candidateController.getNumberOfHiredCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfHiredCandidates();
  }

  @Test
  void getNumberOfHiredCandidateException() {
    when(candidateService.getNumberOfHiredCandidates()).thenThrow(new RuntimeException("Error"));

    try {
      candidateController.getNumberOfHiredCandidates();
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
      assertEquals("Error", e.getMessage());
    }

    verify(candidateService, times(1)).getNumberOfHiredCandidates();
  }

  @Test
  void getNumberOfRejectedCandidates() {
    int count = 5;
    when(candidateService.getNumberOfRejectedCandidates()).thenReturn(count);

    ResponseEntity<Integer> response = candidateController.getNumberOfRejectedCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfRejectedCandidates();
  }

  @Test
  void getNumberOfRejectedCandidatesException() {
    when(candidateService.getNumberOfRejectedCandidates()).thenThrow(new RuntimeException("Error"));

    try {
      candidateController.getNumberOfRejectedCandidates();
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
      assertEquals("Error", e.getMessage());
    }

    verify(candidateService, times(1)).getNumberOfRejectedCandidates();
  }

  @Test
  void getNumberOfOnHoldCandidates() {
    int count = 3;
    when(candidateService.getNumberOfOnHoldCandidates()).thenReturn(count);

    ResponseEntity<Integer> response = candidateController.getNumberOfOnHoldCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfOnHoldCandidates();
  }

  @Test
  void getNumberOfOnHoldCandidatesException() {
    when(candidateService.getNumberOfOnHoldCandidates()).thenThrow(new RuntimeException("Error"));

    try {
      candidateController.getNumberOfOnHoldCandidates();
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
      assertEquals("Error", e.getMessage());
    }

    verify(candidateService, times(1)).getNumberOfOnHoldCandidates();
  }

  @Test
  void getNumberOfInactiveCandidates() {
    int count = 5;
    when(candidateService.getNumberOfInactiveCandidates()).thenReturn(count);

    ResponseEntity<Integer> response = candidateController.getNumberOfInactiveCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(count, response.getBody());
    verify(candidateService, times(1)).getNumberOfInactiveCandidates();
  }

  @Test
  void getNumberOfInactiveCandidatesException() {
    when(candidateService.getNumberOfInactiveCandidates()).thenThrow(new RuntimeException("Error"));

    try {
      candidateController.getNumberOfInactiveCandidates();
    } catch (Exception e) {
      assertEquals(RuntimeException.class, e.getClass());
      assertEquals("Error", e.getMessage());
    }

    verify(candidateService, times(1)).getNumberOfInactiveCandidates();
  }

  @Test
  void getCandidatesWithStage() {
    int key = 1;
    int pageNumber = 0;
    int pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    List<CandidateDetailsDto> candidatesList = new ArrayList<>();
    candidatesList.add(new CandidateDetailsDto());
    candidatesList.add(new CandidateDetailsDto());

    when(candidateService.getCandidatesWithStage(
            key, pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenReturn(candidatesList);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidatesList, response.getBody());
    verify(candidateService, times(1))
        .getCandidatesWithStage(key, pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  @Test
  void getCandidatesWithStage_EmptyList() {
    int key = 1;
    int pageNumber = 0;
    int pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    List<CandidateDetailsDto> emptyList = new ArrayList<>();

    when(candidateService.getCandidatesWithStage(
            key, pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenReturn(emptyList);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    verify(candidateService, times(1))
        .getCandidatesWithStage(key, pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  @Test
  void getCandidatesWithStage_Exception() {
    int key = 1;
    int pageNumber = 0;
    int pageSize = 20;
    String sortField = "id";
    String sortOrder = "ASC";

    when(candidateService.getCandidatesWithStage(
            key, pageNumber, pageSize, sortField, Sort.Direction.ASC))
        .thenThrow(new RuntimeException("Error"));

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    assertEquals(null, response.getBody());
    verify(candidateService, times(1))
        .getCandidatesWithStage(key, pageNumber, pageSize, sortField, Sort.Direction.ASC);
  }

  // DD
  @Test
  void searchCandidatesByKeywordAndStage() {
    String[] keywords = {"keyword1", "keyword2"};
    Integer key = 123;
    int page = 0;
    int size = 10;

    List<CandidateDetailsDto> candidatesPage = Collections.singletonList(new CandidateDetailsDto());

    when(candidateService.getCandidatesWithStageAndKeywords(keywords, key, page, size))
        .thenReturn(candidatesPage);

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidatesByKeywordAndStage(keywords, key, page, size);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidatesPage, response.getBody());
    verify(candidateService, times(1)).getCandidatesWithStageAndKeywords(keywords, key, page, size);
  }

  @Test
  void searchCandidatesByKeywordAndStage_WithException() {
    String[] keywords = {"keyword1", "keyword2"};
    Integer key = 5;
    int page = 0;
    int size = 10;

    when(candidateService.getCandidatesWithStageAndKeywords(keywords, key, page, size))
        .thenThrow(new RuntimeException("Error"));

    ResponseEntity<List<CandidateDetailsDto>> response =
        candidateController.searchCandidatesByKeywordAndStage(keywords, key, page, size);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    assertNull(response.getBody());
    verify(candidateService, times(1)).getCandidatesWithStageAndKeywords(keywords, key, page, size);
  }

  @Test
  void findCandidatesByFilters_WithValidData_ReturnsCandidates() {
    String[] location = {"Location1", "Location2"};
    Integer minCtc = 10;
    Integer maxCtc = 15;
    Integer experience = 5;
    Integer key = 3;
    List<CandidateDetailsDto> candidatesList = new ArrayList<>();
    candidatesList.add(new CandidateDetailsDto());
    Page<CandidateDetailsDto> candidateDtoPage = new PageImpl<>(candidatesList);

    // Mock the service method with page parameter
    when(candidateService.findCandidatesByLocationAndCtcAndExperienceAndStage(
            location, minCtc, maxCtc, experience, key, PageRequest.of(0, 10)))
        .thenReturn(candidateDtoPage);

    ResponseEntity<Page<CandidateDetailsDto>> result =
        candidateController.searchCandidatesByStageAndFilters(
            location, minCtc, maxCtc, experience, key, 0, 10);

    assertEquals(HttpStatus.OK, result.getStatusCode());
    assertEquals(candidateDtoPage, result.getBody());

    verify(candidateService, times(1))
        .findCandidatesByLocationAndCtcAndExperienceAndStage(
            location, minCtc, maxCtc, experience, key, PageRequest.of(0, 10));
  }

  @Test
  void findCandidatesByFilters_WithMissingParameters_ReturnsCandidates() {
    Integer key = 5;
    List<CandidateDetailsDto> candidatesList = new ArrayList<>();
    candidatesList.add(new CandidateDetailsDto());
    Page<CandidateDetailsDto> candidateDtoPage = new PageImpl<>(candidatesList);

    // Mock the service method with page parameter
    when(candidateService.findCandidatesByLocationAndCtcAndExperienceAndStage(
            null, null, null, null, key, PageRequest.of(0, 10)))
        .thenReturn(candidateDtoPage);

    ResponseEntity<Page<CandidateDetailsDto>> result =
        candidateController.searchCandidatesByStageAndFilters(null, null, null, null, key, 0, 10);

    assertEquals(HttpStatus.OK, result.getStatusCode());
    assertEquals(candidateDtoPage, result.getBody());

    verify(candidateService, times(1))
        .findCandidatesByLocationAndCtcAndExperienceAndStage(
            null, null, null, null, key, PageRequest.of(0, 10));
  }

  @Test
  void findAllCandidates_ReturnsCandidatesList() {
    List<Candidates> candidates = Arrays.asList(new Candidates(), new Candidates());

    when(candidateService.findAllCandidates()).thenReturn(candidates);

    ResponseEntity<List<Candidates>> response = candidateController.findAllCandidates();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(candidates, response.getBody());
    verify(candidateService, times(1)).findAllCandidates();
  }

  @Test
  @Disabled
  void exportAllCandidatesDataAsExcel_ReturnsExcelFile() throws IOException {
    List<Candidates> candidates = Arrays.asList(new Candidates(), new Candidates());
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    when(candidateService.findAllCandidates()).thenReturn(candidates);

    Mockito.mockStatic(CandidateService.CandidatesExcelExporter.class);
    when(CandidateService.CandidatesExcelExporter.exportDataToExcel(candidates))
        .thenReturn(outputStream);

    CandidateController candidateController =
        new CandidateController(candidateService, jobPositionService, candidateFeedbackRepository);

    // Act
    ResponseEntity<byte[]> response = candidateController.exportAllCandidatesDataAsExcel();

    // Assert
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(MediaType.APPLICATION_OCTET_STREAM, response.getHeaders().getContentType());
    assertEquals(
        "form-data; name=\"attachment\"; filename=\"Data.xlsx\"",
        response.getHeaders().getContentDisposition().toString());
    assertArrayEquals(outputStream.toByteArray(), response.getBody());
    Mockito.verify(candidateService, times(1)).findAllCandidates();
  }

  //  @Test
  //  void exportCandidateFeedbackToExcel_ReturnsExcelFile() throws IOException {
  //    // Arrange
  //    List<CandidateFeedback> feedbackList = Arrays.asList(new CandidateFeedback(), new
  // CandidateFeedback());
  //    byte[] excelData = "Excel Data".getBytes();
  //
  //    when(candidateFeedbackRepository.findAll()).thenReturn(feedbackList);
  //
  // when(CandidateService.CandidatesExcelExporter.exportCandidateFeedbackToExcel(feedbackList)).thenReturn(new ByteArrayOutputStream());
  //
  //    // Act
  //    ResponseEntity<byte[]> response = new CandidateController(candidateService,
  // jobPositionService, candidateFeedbackRepository).exportCandidateFeedbackToExcel();
  //
  //    // Assert
  //    assertEquals(HttpStatus.OK, response.getStatusCode());
  //    assertNotNull(response.getBody());
  //    assertArrayEquals(excelData, response.getBody());
  //
  //    HttpHeaders headers = response.getHeaders();
  //    assertEquals(MediaType.APPLICATION_OCTET_STREAM, headers.getContentType());
  //    assertEquals("attachment; filename=candidate_feedback.xlsx",
  // headers.getContentDisposition().toString());
  //
  //    verify(candidateFeedbackRepository, times(1)).findAll();
  //  }
}
