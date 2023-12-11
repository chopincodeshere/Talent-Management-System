package com.tecunique.tms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.tecunique.tms.dto.CandidateDetailsDto;
import com.tecunique.tms.entity.*;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.CandidateFeedbackRepository;
import com.tecunique.tms.repository.CandidateRepository;
import com.tecunique.tms.repository.JobPositionRepository;
import com.tecunique.tms.services.CandidateService;
import com.tecunique.tms.services.CandidatesExcelExporter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CandidateServiceTest {
  @InjectMocks private CandidateService candidateService;

  @Mock private CandidateRepository candidateRepository;

  @Mock private CandidateFeedbackRepository candidateFeedbackRepository;
  @Mock private JobPositionRepository jobPositionRepository;

  private Candidates candidates;
  private Candidates candidates2;

  @BeforeEach
  void init() {
    LocalDate yearOfAchievement = LocalDate.of(2022, 12, 10);
    Education education =
        Education.builder()
            .highestDegree("Bachelors")
            .specialization("Computer Engineering")
            .yearOfAchievement(yearOfAchievement)
            .build();

    LocalDate start = LocalDate.of(2018, 4, 10);
    LocalDate finish = LocalDate.of(2023, 9, 15);
    List<Employment> employmentList = new ArrayList<>();
    Employment employment =
        Employment.builder()
            .companyName("ABC")
            .designation("Software Developer")
            .previousCTC("6")
            .location("Mumbai")
            .workingStatus("Currently working")
            .start(start)
            .finish(finish)
            .build();
    employmentList.add(employment);

    Referral referral = Referral.builder().referred_fname("Ashu").referred_lname("Singh").build();

    CurrentAddress currentAddress =
        CurrentAddress.builder()
            .currentCountry("India")
            .currentState("Gujarat")
            .currentCity("Vadodara")
            .build();
    PermanentAddress permanentAddress =
        PermanentAddress.builder()
            .permanentCountry("India")
            .permanentState("Gujarat")
            .permanentCity("Vadodara")
            .build();
    Address address =
        Address.builder().currentAddress(currentAddress).permanentAddress(permanentAddress).build();

    String[] skills = {"java", "Spring Boot"};
    candidates =
        Candidates.builder()
            .id(1L)
            .firstName("Neel")
            .address(address)
            .education(education)
            .employment(employmentList)
            .referral(referral)
            .lastName("Javia")
            .email("neel42@gmail.com")
            .mobilePhone("9876543210")
            .source("Social Media")
            .note("")
            .totalExperience(7)
            .jobPosition(new JobPosition())
            .currentCTC((float) 7)
            .expectedCTC((float) 7)
            .currentNoticePeriod("1")
            .keySkills(skills)
            .workMode("Hybrid")
            .communicationSkills(5)
            .build();

    String[] skills2 = {"HTML", "CSS", "Java Script"};
    candidates2 =
        Candidates.builder()
            .id(2L)
            .firstName("Jil")
            .address(address)
            .education(education)
            .employment(employmentList)
            .referral(referral)
            .lastName("Patel")
            .email("jil7721@gmail.com")
            .mobilePhone("1234567890")
            .source("Newspaper")
            .note("qeadhauidh")
            .totalExperience(12)
            .jobPosition(new JobPosition())
            .currentCTC((float) 10)
            .expectedCTC((float) 15)
            .currentNoticePeriod("5")
            .keySkills(skills2)
            .workMode("Hybrid")
            .communicationSkills(7)
            .build();
  }

  @Test
  @DisplayName("It should save candidate object to database")
  void addCandidate() {

    Candidates candidate = new Candidates();
    candidate.setJob_id(1L);

    JobPosition jobPosition = new JobPosition();
    jobPosition.setId(1L);

    when(candidateRepository.save(any(Candidates.class))).thenReturn(candidate);
    when(jobPositionRepository.findJobPositionById(1L)).thenReturn(jobPosition);

    Candidates savedCandidate = candidateService.addCandidate(candidate);

    assertNotNull(savedCandidate.getCandidateCode());

    assertEquals(jobPosition, savedCandidate.getJobPosition());

    verify(candidateRepository).save(candidate);

    // when(candidateRepository.save(any(Candidates.class))).thenReturn(candidates);
    //
    // Candidates newCandidate = candidateService.addCandidate(candidates);
    // assertNotNull(newCandidate);
    // assertEquals(candidates.getId(), newCandidate.getId());
    // assertEquals(candidates.getCandidateCode(), newCandidate.getCandidateCode());
    // assertThat(newCandidate.getEmail()).isEqualTo("neel42@gmail.com");
    // verify(candidateRepository, times(1)).save(candidates);
  }

  @Test
  void getCandidateByName() {
    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.of(candidates));

    String fullName = candidateService.getCandidateByName(candidates.getId());

    assertEquals(candidates.getFirstName() + " " + candidates.getLastName(), fullName);
    System.out.println(fullName);
    verify(candidateRepository, times(1)).findById(candidates.getId());
  }

  @Test
  @DisplayName("Should update the candidate")
  void updateCandidate() {

    when(candidateRepository.findById(anyLong())).thenReturn(Optional.of(candidates));
    when(candidateRepository.save(any(Candidates.class))).thenReturn(candidates);

    candidates.setEmail("neeljavia51@gmail.com");

    Candidates updatedCandidate = candidateService.updateCandidate(1L, candidates);
    assertNotNull(updatedCandidate);
    assertEquals("neeljavia51@gmail.com", updatedCandidate.getEmail());
  }

  @Test
  @DisplayName("Should delete the candidate")
  void deleteCandidate() {

    when(candidateRepository.findById(anyLong())).thenReturn(Optional.of(candidates));

    // As the return of delete() is void, do Nothing() is used
    doNothing().when(candidateRepository).deleteById(anyLong());

    candidateService.deleteCandidate(1L);

    verify(candidateRepository, times(1)).deleteById(1L);
  }

  @Test
  void getCandidateByJobPosition() {
    Long jobId = 2L;
    candidates.setJob_id(jobId);

    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.of(candidates));

    Long foundJobId = candidateService.getCandidateByPosition(candidates.getId());

    assertEquals(jobId, foundJobId);
    verify(candidateRepository, times(1)).findById(candidates.getId());
  }

  @Test
  void getCandidateByJobPosition_NotFound() {
    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.empty());

    Long foundJobId = candidateService.getCandidateByPosition(candidates.getId());

    assertNull(foundJobId);
    verify(candidateRepository, times(1)).findById(candidates.getId());
  }

  @Test
  void getCandidateById() {
    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.of(candidates));

    when(candidateRepository.findById(candidates2.getId())).thenReturn(Optional.of(candidates2));

    Candidates foundCandidates = candidateService.getCandidateById(candidates.getId());
    //    Candidates foundCandidates2 = candidateService.getCandidateById(candidates2.getId());

    assertEquals(candidates.getId(), foundCandidates.getId());
    verify(candidateRepository, times(1)).findById(candidates.getId());

    //    assertEquals(candidates2.getId(), foundCandidates2.getId());
    //    verify(candidateRepository, times(1)).findById(candidates2.getId());
  }

  @Test
  void getCandidateById_NotFound() {
    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.empty());

    assertThrows(
        ResourceNotFoundException.class,
        () -> candidateService.getCandidateById(candidates.getId()));

    verify(candidateRepository, times(1)).findById(candidates.getId());
  }

  @Test
  void addCandidateFeedback_Success() {

    Long candidateNewId = 5L;
    candidates.getJobPosition().setJobTitle("Software Developer");

    CandidateFeedback candidateFeedback = new CandidateFeedback();
    candidateFeedback.setCandidateName("John Doe");
    candidateFeedback.setDateOfInterview(LocalDate.now());
    candidateFeedback.setPositionAppliedFor("Software Developer");

    when(candidateRepository.findById(candidateNewId)).thenReturn(Optional.of(candidates));
    when(candidateRepository.save(any())).thenReturn(candidates);

    CandidateFeedback savedFeedback =
        candidateService.addCandidateFeedback(candidateNewId, candidateFeedback);
    verify(candidateRepository, times(1)).findById(candidateNewId);
    verify(candidateRepository, times(1)).save(ArgumentMatchers.any(Candidates.class));

    assertEquals("Software Developer", candidates.getJobPosition().getJobTitle());
  }

  @Test
  void addCandidateFeedback_NullFeedback() {
    String feedback = null;

    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.empty());

    CandidateFeedback savedFeedback =
        CandidateFeedback.builder().candidates(candidates).result(feedback).build();

    assertThrows(
        ResourceNotFoundException.class,
        () -> candidateService.addCandidateFeedback(candidates.getId(), savedFeedback));

    verify(candidateRepository).findById(candidates.getId());
    verify(candidateFeedbackRepository, never()).save(any(CandidateFeedback.class));
  }

  @Test
  void findAllCandidates() {
    List<Candidates> candidatesList =
        candidateRepository.saveAll(Arrays.asList(candidates, candidates2));

    when(candidateRepository.findAll()).thenReturn(candidatesList);

    List<Candidates> actualCandidates = candidateService.findAllCandidates();

    assertEquals(candidatesList, actualCandidates);
  }

  @Test
  void findAllCandidates_EmptyList() {
    List<Candidates> expectedCandidates = new ArrayList<>();

    when(candidateRepository.findAll()).thenReturn(expectedCandidates);

    List<Candidates> actualCandidates = candidateService.findAllCandidates();

    assertEquals(expectedCandidates, actualCandidates);
  }

  @Test
  void findAllCandidates_NullList() {
    List<Candidates> expectedCandidates = null;

    when(candidateRepository.findAll()).thenReturn(expectedCandidates);

    List<Candidates> actualCandidates = candidateService.findAllCandidates();

    assertEquals(expectedCandidates, actualCandidates);
  }

  @Test
  void getTotalNumberOfRecords() {
    long expectedTotal = 8L;

    when(candidateRepository.count()).thenReturn(expectedTotal);

    long actualTotal = candidateService.getTotalNumberOfRecords();

    assertEquals(expectedTotal, actualTotal);
  }

  @Test
  void getAllCandidates() {
    int pageNumber = 0;
    int pageSize = 10;
    String sortField = "firstName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    List<Candidates> candidatesList = new ArrayList<>();
    candidatesList.add(candidates);
    candidatesList.add(candidates2);

    Page<Candidates> candidatesPage = new PageImpl<>(candidatesList);
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    when(candidateRepository.findAll(pageRequest)).thenReturn(candidatesPage);

    List<CandidateDetailsDto> result =
        candidateService.getAllCandidates(pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
    assertEquals("Neel", result.get(0).getFirstName());
    assertEquals("Jil", result.get(1).getFirstName());

    verify(candidateRepository, times(1)).findAll(pageRequest);
  }

  @Test
  @Disabled
  void searchCandidates() {
    String[] keywords = {};

    List<Candidates> candidatesList = new ArrayList<>();
    candidatesList.add(candidates);
    candidatesList.add(candidates2);
    Page<Candidates> candidatePage = mock(Page.class);
    when(candidateRepository.findAll()).thenReturn(candidatesList);
    when(candidateRepository.findAll(any(Pageable.class))).thenReturn(candidatePage);

    List<CandidateDetailsDto> result = candidateService.searchCandidates(keywords, 1, 10);
    assertEquals(2, result.size());

    assertEquals("Neel", result.get(0).getFirstName());
    assertEquals("Jil", result.get(1).getFirstName());
  }

  @Test
  void addInterviewerNote() {
    String interviewerNote = "Great candidate";

    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.of(candidates));
    when(candidateRepository.save(candidates)).thenReturn(candidates);
    candidateService.addInterviewerNote(candidates.getId(), interviewerNote);
    assertEquals(15, candidates.getNotesByInterviewer().length());
    assertEquals(interviewerNote, candidates.getNotesByInterviewer());
  }

  @Test
  void updateRound() {
    int roundNumber = 2;

    when(candidateRepository.findById(candidates.getId())).thenReturn(Optional.of(candidates));
    when(candidateRepository.save(candidates)).thenReturn(candidates);

    candidateService.updateRound(candidates.getId(), roundNumber);

    assertEquals(roundNumber, candidates.getRound());
  }

  @Test
  void findCandidatesByLocationAndCtcAndExperience() {
    String[] location = {"Sydney"};
    Integer minCtc = 10;
    Integer maxCtc = 12;
    Integer experience = 5;
    int page = 0;
    int size = 10;

    CurrentAddress newCurrentAddress =
        CurrentAddress.builder()
            .currentCountry("Australia")
            .currentState("NSW")
            .currentCity("Sydney")
            .build();

    candidates.setAddress(Address.builder().currentAddress(newCurrentAddress).build());
    candidates.setCurrentCTC(minCtc.floatValue());
    candidates.setExpectedCTC(maxCtc.floatValue());
    candidates.setTotalExperience(experience);

    candidates2.setAddress(Address.builder().currentAddress(newCurrentAddress).build());
    candidates2.setCurrentCTC(minCtc.floatValue());
    candidates.setExpectedCTC(maxCtc.floatValue());
    candidates2.setTotalExperience(experience);

    List<Candidates> candidatesList = new ArrayList<>();
    candidatesList.add(candidates);
    candidatesList.add(candidates2);

    when(candidateRepository
            .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThan(
                location, minCtc, maxCtc, experience, PageRequest.of(page, size)))
        .thenReturn(new PageImpl<>(candidatesList));

    Page<CandidateDetailsDto> result =
        candidateService.findCandidatesByLocationAndCtcAndExperience(
            location, minCtc, maxCtc, experience, page, size);

    assertEquals(2, result.getTotalElements());
    assertEquals(
        "Sydney", result.getContent().get(0).getAddress().getCurrentAddress().getCurrentCity());
    assertEquals(
        "Sydney", result.getContent().get(1).getAddress().getCurrentAddress().getCurrentCity());
  }

  @Test
  void getNumberOfCandidatesByJobId() {
    Long jobId = 1L;
    int expectedCount = 5;

    when(candidateRepository.countCandidatesByJobId(jobId)).thenReturn((long) expectedCount);

    int result = Math.toIntExact(candidateService.getNumberOfCandidatesByJobId(jobId));

    assertEquals(expectedCount, result);
    verify(candidateRepository, times(1)).countCandidatesByJobId(jobId);
  }

  @Test
  void getNumberOfCandidatesByJobId_WhenNoCandidatesExist() {
    Long jobId = 1L;
    int expectedCount = 0;

    when(candidateRepository.countCandidatesByJobId(jobId)).thenReturn((long) expectedCount);

    int result = Math.toIntExact(candidateService.getNumberOfCandidatesByJobId(jobId));

    assertEquals(expectedCount, result);
    verify(candidateRepository, times(1)).countCandidatesByJobId(jobId);
  }

  @Test
  void getNumberOfShortlistedCandidates() {
    List<Candidates> shortListedCandidates = new ArrayList<>();
    shortListedCandidates.add(new Candidates());
    when(candidateRepository.findAllWithRoundTwoOrMore()).thenReturn(shortListedCandidates);

    Integer result = candidateService.getNumberOfShortlistedCandidates();
    assertEquals(1, result);
  }

  @Test
  void getNumberOfHiredCandidates() {

    List<Candidates> hiredCandidates = new ArrayList<>();
    hiredCandidates.add(new Candidates());

    when(candidateRepository.findByStage("Hired")).thenReturn(hiredCandidates);

    Integer result = candidateService.getNumberOfShortlistedCandidates();

    assertEquals(0, result);
  }

  @Test
  void getNumberOfOnHoldCandidates() {
    candidates.setStage("On Hold");
    candidates2.setStage("On Hold");
    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);

    when(candidateRepository.findByStage("On Hold")).thenReturn(candidatesList);

    Integer numberOfOnHoldCandidates = candidateService.getNumberOfOnHoldCandidates();

    assertEquals(2, numberOfOnHoldCandidates);
  }

  @Test
  void getNumberOfOnHoldCandidates_NoCandidateOnHold() {
    List<Candidates> candidatesList = Collections.emptyList();
    when(candidateRepository.findByStage("On Hold")).thenReturn(candidatesList);

    Integer numberOfOnHoldCandidates = candidateService.getNumberOfOnHoldCandidates();

    assertEquals(0, numberOfOnHoldCandidates);
  }

  @Test
  void getNumberOfRejectedCandidates() {
    candidates.setStage("Rejected");
    candidates2.setStage("Rejected");
    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);

    when(candidateRepository.findByStage("Rejected")).thenReturn(candidatesList);

    Integer numberOfRejectedCandidates = candidateService.getNumberOfRejectedCandidates();

    assertEquals(2, numberOfRejectedCandidates);
  }

  @Test
  void getNumberOfRejectedCandidates_NoCandidatesRejected() {
    List<Candidates> candidatesList = Collections.emptyList();
    when(candidateRepository.findByStage("Rejected")).thenReturn(candidatesList);

    Integer numberOfRejectedCandidates = candidateService.getNumberOfRejectedCandidates();

    assertEquals(0, numberOfRejectedCandidates);
  }

  @Test
  void getNumberOfInactiveCandidates() {
    Candidates candidates1 = new Candidates();
    Candidates candidates2 = new Candidates();
    List<Candidates> candidatesList = Arrays.asList(candidates1, candidates2);
    when(candidateRepository.findByStage("Inactive")).thenReturn(candidatesList);

    Integer numberOfInactiveCandidates = candidateService.getNumberOfInactiveCandidates();

    assertEquals(2, numberOfInactiveCandidates);
  }

  @Test
  void getNumberOfInactiveCandidates_NoCandidateInactive() {
    List<Candidates> candidatesList = Collections.emptyList();
    when(candidateRepository.findByStage("Inactive")).thenReturn(candidatesList);

    Integer numberOfInactiveCandidates = candidateService.getNumberOfInactiveCandidates();

    assertEquals(0, numberOfInactiveCandidates);
  }

  @Test
  void getCandidateWithStage_Key3_ReturnShortlistedCandidates() {
    Integer key = 3;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findAllWithRoundTwoOrMore(pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
  }

  @Test
  void getCandidatesWithStage_Key4_ReturnsHiredCandidates() {
    Integer key = 4;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findByStage("Hired", pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
  }

  @Test
  void getCandidatesWithStage_Key5_ReturnsOnHoldCandidates() {
    Integer key = 5;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findByStage("On Hold", pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
  }

  @Test
  void getCandidatesWithStage_Key6_ReturnsRejectedCandidates() {
    Integer key = 6;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findByStage("Rejected", pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
  }

  @Test
  void getCandidatesWithStage_Key7_ReturnsInactiveCandidates() {
    Integer key = 7;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findByStage("Inactive", pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    assertEquals(candidatesList.size(), result.size());
  }

  @Test
  void getCandidatesWithStage_DefaultKey_ReturnsAllCandidates() {
    Integer key = 10;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortField = "fieldName";
    Sort.Direction sortOrder = Sort.Direction.ASC;

    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findAll(pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStage(key, pageNumber, pageSize, sortField, sortOrder);

    verify(candidateRepository, times(1)).findAll(pageRequest);

    assertEquals(candidatesList.size(), result.size());
    assertEquals(candidatesList.get(0).getFirstName(), result.get(0).getFirstName());
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key3_NoKeywords() {
    String[] keywords = new String[0];
    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    PageRequest pageRequest = PageRequest.of(0, 10);

    Page<Candidates> pageCandidates =
        new PageImpl<>(candidatesList, pageRequest, candidatesList.size());

    when(candidateRepository.findAllWithRoundTwoOrMore(pageRequest)).thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, 3, 0, 10);

    assertEquals(2, result.size());
    verify(candidateRepository, times(1)).findAllWithRoundTwoOrMore(pageRequest);
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key3_WithKeywords() {
    candidates.setRound(2);
    candidates2.setRound(3);
    String[] keywords = {"CSS"};
    Integer key = 3;
    Integer pageNumber = 0;
    Integer pageSize = 10;

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findAllWithRoundTwoOrMoreAndKeyword(anyString(), any(Pageable.class)))
        .thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, key, pageNumber, pageSize);

    assertEquals(2, result.size());
    verify(candidateRepository, times(1))
        .findAllWithRoundTwoOrMoreAndKeyword(anyString(), any(Pageable.class));
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key4_NoKeywords() {
    candidates.setRound(2);
    candidates.setStage("Hired");
    candidates2.setStage("Hired");
    candidates2.setRound(3);
    String[] keywords = {};
    Integer key = 4;
    int pageNumber = 0;
    int pageSize = 10;

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    Page<Candidates> pageCandidates = new PageImpl<>(candidatesList);

    when(candidateRepository.findByStage(eq("Hired"), any(PageRequest.class)))
        .thenReturn(pageCandidates);

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, key, pageNumber, pageSize);

    assertEquals(2, result.size());
    assertEquals("Neel", result.get(0).getFirstName());
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key4_WithKeywords() {
    candidates.setRound(2);
    candidates.setStage("Hired");
    candidates2.setStage("On Hold");
    candidates2.setRound(3);
    String[] keywords = {"neel42@gmail.com"};
    Integer key = 4;
    int page = 0;
    int size = 10;

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);

    when(candidateRepository.findByKeywordAndStage(
            eq("neel42@gmail.com"), eq("Hired"), any(Pageable.class)))
        .thenReturn(new PageImpl<>(candidatesList.subList(0, 1)));

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, key, page, size);

    assertEquals(1, result.size());
    verify(candidateRepository, times(1))
        .findByKeywordAndStage(eq("neel42@gmail.com"), eq("Hired"), any(Pageable.class));
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key5_NoKeywords() {
    String[] keywords = new String[0];
    int page = 0;
    int size = 10;
    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);

    when(candidateRepository.findByStage(eq("On Hold"), (PageRequest) any(Pageable.class)))
        .thenReturn(new PageImpl<>(candidatesList));

    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, 5, page, size);

    assertEquals(2, result.size());
    verify(candidateRepository).findByStage(eq("On Hold"), (PageRequest) any(Pageable.class));
  }

  @Test
  void getCandidatesWithStageAndKeywords_Key5_WithKeywords() {
    // Arrange
    candidates.setStage("On Hold");
    candidates2.setStage("On Hold");
    String[] keywords = {"CSS"};
    Integer key = 5;
    int page = 0;
    int size = 10;

    List<Candidates> candidatesList = Arrays.asList(candidates, candidates2);
    when(candidateRepository.findByKeywordAndStage(anyString(), eq("On Hold"), any()))
        .thenReturn(new PageImpl<>(candidatesList));

    // Act
    List<CandidateDetailsDto> result =
        candidateService.getCandidatesWithStageAndKeywords(keywords, key, page, size);

    // Assert
    assertEquals(2, result.size());
    verify(candidateRepository, times(1)).findByKeywordAndStage(anyString(), eq("On Hold"), any());
  }

  @Test
  void exportDataToExcel_NoData_ReturnsEmptyWorkbook() throws IOException {
    List<Candidates> data = new ArrayList<>();

    ByteArrayOutputStream outputStream = CandidatesExcelExporter.exportDataToExcel(data);
    Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(outputStream.toByteArray()));

    assertEquals(1, workbook.getNumberOfSheets()); // One sheet should be created
    Sheet sheet = workbook.getSheetAt(0);
    assertEquals("All Candidate's Data", sheet.getSheetName()); // Sheet name should match
    assertEquals(0, sheet.getLastRowNum()); // No data rows should be present

    workbook.close();
  }

  @Test
  void exportDataToExcel_WithData_ReturnsWorkbookWithCorrectData() throws IOException {
    List<Candidates> data = Arrays.asList(candidates, candidates2);
    candidates.setJob_id(1L);
    candidates2.setJob_id(2L);

    ByteArrayOutputStream outputStream = CandidatesExcelExporter.exportDataToExcel(data);
    Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(outputStream.toByteArray()));

    assertEquals(1, workbook.getNumberOfSheets());
    Sheet sheet = workbook.getSheetAt(0);
    assertEquals("All Candidate's Data", sheet.getSheetName());

    // Verify the data in the workbook
    assertEquals(2, sheet.getLastRowNum());
    Row headerRow = sheet.getRow(0);
    assertEquals("Candidate ID", headerRow.getCell(0).getStringCellValue());
    assertEquals("First Name", headerRow.getCell(1).getStringCellValue());

    // Verify the data in the first row
    Row firstDataRow = sheet.getRow(1);
    assertEquals(1, firstDataRow.getCell(0).getNumericCellValue());
    assertEquals("Neel", firstDataRow.getCell(1).getStringCellValue());

    // Verify the data in the second row
    Row secondDataRow = sheet.getRow(2);
    assertEquals(2, secondDataRow.getCell(0).getNumericCellValue());
    assertEquals("Jil", secondDataRow.getCell(1).getStringCellValue());

    workbook.close();
  }

  @Test
  void exportJobPositionToExcel_WithValidJobPositions_ReturnsWorkbookWithCorrectData()
      throws IOException {
    List<JobPosition> jobPositions =
        Arrays.asList(
            createJobPosition(1, "Job Title 1", Arrays.asList("Manager 1", "Manager 2"), "Open", 3),
            createJobPosition(
                2, "Job Title 2", Arrays.asList("Manager 3", "Manager 4"), "Closed", 2));

    ByteArrayOutputStream outputStream =
        CandidatesExcelExporter.exportJobPositionToExcel(jobPositions);
    Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(outputStream.toByteArray()));

    assertEquals(1, workbook.getNumberOfSheets());
    Sheet sheet = workbook.getSheetAt(0);
    assertEquals("Job Positions", sheet.getSheetName());

    // Verify the data in the workbook
    assertEquals(2, sheet.getLastRowNum());
    Row headerRow = sheet.getRow(0);
    assertEquals("ID", headerRow.getCell(0).getStringCellValue());
    assertEquals("Job Title", headerRow.getCell(1).getStringCellValue());
    assertEquals("Hiring Managers", headerRow.getCell(2).getStringCellValue());
    assertEquals("Job Status", headerRow.getCell(3).getStringCellValue());
    assertEquals("No. of Candidates", headerRow.getCell(4).getStringCellValue());

    // Verify the data in the first row
    Row firstDataRow = sheet.getRow(1);
    assertEquals(1, firstDataRow.getCell(0).getNumericCellValue());
    assertEquals("Job Title 1", firstDataRow.getCell(1).getStringCellValue());
    assertEquals("Manager 1, Manager 2", firstDataRow.getCell(2).getStringCellValue());
    assertEquals("Open", firstDataRow.getCell(3).getStringCellValue());
    assertEquals(3, (int) firstDataRow.getCell(4).getNumericCellValue());

    // Verify the data in the second row
    Row secondDataRow = sheet.getRow(2);
    assertEquals(2, secondDataRow.getCell(0).getNumericCellValue());
    assertEquals("Job Title 2", secondDataRow.getCell(1).getStringCellValue());
    assertEquals("Manager 3, Manager 4", secondDataRow.getCell(2).getStringCellValue());
    assertEquals("Closed", secondDataRow.getCell(3).getStringCellValue());
    assertEquals(2, (int) secondDataRow.getCell(4).getNumericCellValue());

    workbook.close();
  }

  private JobPosition createJobPosition(
      int id, String jobTitle, List<String> hiringManagers, String jobStatus, int candidateCount) {
    JobPosition jobPosition = new JobPosition();
    jobPosition.setId((long) id);
    jobPosition.setJobTitle(jobTitle);

    String[] hiringManagersArray = hiringManagers.toArray(new String[0]);
    jobPosition.setHiringManagers(hiringManagersArray);

    jobPosition.setJobStatus(jobStatus);

    Candidates[] candidatesArray = new Candidates[candidateCount];
    for (int i = 0; i < candidateCount; i++) {
      candidatesArray[i] = new Candidates();
    }
    jobPosition.setCandidates(Arrays.asList(candidatesArray));

    return jobPosition;
  }

  @Test
  void exportCandidateFeedbackToExcel_WithValidFeedbackList_ReturnsWorkbookWithCorrectData()
      throws IOException {
    // Arrange
    List<CandidateFeedback> feedbackList =
        Arrays.asList(
            createCandidateFeedback(
                1,
                "John Doe",
                LocalDate.of(2023, 7, 1),
                "Job Title 1",
                "Interviewer 1",
                4,
                5,
                3,
                4,
                5,
                3,
                4,
                "Good performance",
                "Selected"),
            createCandidateFeedback(
                2,
                "Jane Smith",
                LocalDate.of(2023, 7, 2),
                "Job Title 2",
                "Interviewer 2",
                3,
                4,
                5,
                3,
                4,
                5,
                3,
                "Average performance",
                "Not Selected"));

    ByteArrayOutputStream outputStream =
        CandidatesExcelExporter.exportCandidateFeedbackToExcel(feedbackList);
    Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(outputStream.toByteArray()));

    // Assert
    assertEquals(1, workbook.getNumberOfSheets());
    Sheet sheet = workbook.getSheetAt(0);
    assertEquals("Candidate Feedback", sheet.getSheetName());

    // Verify the data in the workbook
    assertEquals(2, sheet.getLastRowNum());
    Row headerRow = sheet.getRow(0);
    assertEquals("Feedback ID", headerRow.getCell(0).getStringCellValue());
    assertEquals("Candidate Name", headerRow.getCell(1).getStringCellValue());
    assertEquals("Date of Interview", headerRow.getCell(2).getStringCellValue());
    assertEquals("Position Applied For", headerRow.getCell(3).getStringCellValue());
    assertEquals("Interviewer", headerRow.getCell(4).getStringCellValue());
    assertEquals("Educational Background Rating", headerRow.getCell(5).getStringCellValue());
    assertEquals("Work Experience Rating", headerRow.getCell(6).getStringCellValue());
    assertEquals("Technical Skills Rating", headerRow.getCell(7).getStringCellValue());
    assertEquals("Communication Skills Rating", headerRow.getCell(8).getStringCellValue());
    assertEquals("Candidate Interests Rating", headerRow.getCell(9).getStringCellValue());
    assertEquals("Interpersonal Skills Rating", headerRow.getCell(10).getStringCellValue());
    assertEquals("Overall Rating", headerRow.getCell(11).getStringCellValue());
    assertEquals("Comments", headerRow.getCell(12).getStringCellValue());
    assertEquals("Result", headerRow.getCell(13).getStringCellValue());

    // Verify the data in the first row
    Row firstDataRow = sheet.getRow(1);
    assertEquals(1.0, firstDataRow.getCell(0).getNumericCellValue());
    assertEquals("John Doe", firstDataRow.getCell(1).getStringCellValue());
    assertEquals(
        LocalDate.of(2023, 7, 1),
        firstDataRow.getCell(2).getLocalDateTimeCellValue().toLocalDate());
    assertEquals("Job Title 1", firstDataRow.getCell(3).getStringCellValue());
    assertEquals("Interviewer 1", firstDataRow.getCell(4).getStringCellValue());
    assertEquals(4, (int) firstDataRow.getCell(5).getNumericCellValue());
    assertEquals(5, (int) firstDataRow.getCell(6).getNumericCellValue());
    assertEquals(3, (int) firstDataRow.getCell(7).getNumericCellValue());
    assertEquals(4.0, firstDataRow.getCell(11).getNumericCellValue());
    assertEquals(5, (int) firstDataRow.getCell(9).getNumericCellValue());
    assertEquals(3, (int) firstDataRow.getCell(10).getNumericCellValue());
    assertEquals("Good performance", firstDataRow.getCell(12).getRichStringCellValue().getString());
    assertEquals("Selected", firstDataRow.getCell(13).getRichStringCellValue().getString());

    // Verify the data in the second row
    Row secondDataRow = sheet.getRow(2);
    assertEquals(2.0, secondDataRow.getCell(0).getNumericCellValue());
    assertEquals("Jane Smith", secondDataRow.getCell(1).getStringCellValue());
    assertEquals(
        LocalDate.of(2023, 7, 2),
        secondDataRow.getCell(2).getLocalDateTimeCellValue().toLocalDate());
    assertEquals("Job Title 2", secondDataRow.getCell(3).getStringCellValue());
    assertEquals("Interviewer 2", secondDataRow.getCell(4).getStringCellValue());
    assertEquals(3, (int) secondDataRow.getCell(5).getNumericCellValue());
    assertEquals(4, (int) secondDataRow.getCell(6).getNumericCellValue());
    assertEquals(5, (int) secondDataRow.getCell(7).getNumericCellValue());
    assertEquals(3, (int) secondDataRow.getCell(8).getNumericCellValue());
    assertEquals(4, (int) secondDataRow.getCell(9).getNumericCellValue());
    assertEquals(5, (int) secondDataRow.getCell(10).getNumericCellValue());
    assertEquals(
        "Average performance", secondDataRow.getCell(12).getRichStringCellValue().getString());
    assertEquals("Not Selected", secondDataRow.getCell(13).getRichStringCellValue().getString());

    workbook.close();
  }

  private CandidateFeedback createCandidateFeedback(
      int id,
      String candidateName,
      LocalDate dateOfInterview,
      String positionAppliedFor,
      String interviewer,
      int eduRating,
      int workExpRating,
      int techSkillsRating,
      int commSkillsRating,
      int candidateInterestsRating,
      int interpersonalSkillsRating,
      int overallRating,
      String comments,
      String result) {
    CandidateFeedback feedback = new CandidateFeedback();
    feedback.setId((long) id);
    feedback.setCandidateName(candidateName);
    feedback.setDateOfInterview(dateOfInterview);
    feedback.setPositionAppliedFor(positionAppliedFor);
    feedback.setInterviewer(interviewer);
    feedback.setEducationalBackgroundRating(eduRating);
    feedback.setWorkExperienceRating(workExpRating);
    feedback.setTechnicalSkillsRating(techSkillsRating);
    feedback.setCommunicationSkillsRating(commSkillsRating);
    feedback.setCandidateInterestRating(candidateInterestsRating);
    feedback.setInterpersonalSkillsRating(interpersonalSkillsRating);
    feedback.setOverallRating(overallRating);
    feedback.setComments(comments);
    feedback.setResult(result);
    return feedback;
  }
}
