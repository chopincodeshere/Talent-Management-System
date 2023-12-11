package com.tecunique.tms.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.*;
import java.time.LocalDate;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTestContextBootstrapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.BootstrapWith;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@DataJpaTest
@BootstrapWith(value = SpringBootTestContextBootstrapper.class)
@Transactional
public class CandidateRepositoryTest {

  @Autowired public CandidateRepository candidateRepository;

  private Candidates candidates;
  private Candidates candidates2;
  @Autowired private JobPositionRepository jobPositionRepository;

  @BeforeEach
  void init() {
    LocalDate yearOfAchievement = LocalDate.of(2021, 5, 4);
    Education education =
        Education.builder()
            .highestDegree("Bachelors")
            .specialization("Computer Engineering")
            .yearOfAchievement(yearOfAchievement)
            .build();

    Education education2 =
        Education.builder()
            .highestDegree("Masters")
            .specialization("Information Technology")
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

    JobPosition jobPosition =
        JobPosition.builder()
            .jobTitle("Java Software Engineer(OP)")
            .hiringManagers(new String[] {"Jaydeep Chhasatia", "Dan Mihalache", "Mickeal A."})
            .jobStatus("Open")
            .jobDescription(null)
            .build();

    JobPosition jobPosition2 =
        JobPosition.builder()
            .jobTitle("Sr. QA Engineer(QT)")
            .hiringManagers(
                new String[] {"Jaydeep Chhasatia", "Gianluca La Brusco", "Cristian Oancea"})
            .jobStatus("Closed")
            .jobDescription(null)
            .build();

    candidates =
        Candidates.builder()
            .id(1L)
            .candidateCode("789")
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
            .currentCTC((float) 7)
            .expectedCTC((float) 5)
            .currentNoticePeriod("1")
            .keySkills(skills)
            .workMode("Hybrid")
            .communicationSkills(5)
            .jobPosition(jobPosition)
            .build();

    String[] skills2 = {"HTML", "CSS", "Java Script", "java"};
    candidates2 =
        Candidates.builder()
            .id(2L)
            .candidateCode("123")
            .firstName("Jil")
            .address(address)
            .education(education2)
            .employment(employmentList)
            .referral(referral)
            .lastName("Patel")
            .email("jil7721@gmail.com")
            .mobilePhone("1234567890")
            .source("Newspaper")
            .note("Tiger")
            .totalExperience(12)
            .currentCTC((float) 10)
            .expectedCTC((float) 15)
            .currentNoticePeriod("5")
            .keySkills(skills2)
            .workMode("Hybrid")
            .communicationSkills(7)
            .jobPosition(jobPosition2)
            .build();
  }

  @AfterEach
  void cleanUp() {
    // Clean up the database after each test
    candidateRepository.deleteAll();
  }

  @Test
  @DisplayName("It should save candidate")
  void saveCandidate() {

    // Arrange

    // Act
    candidateRepository.saveAndFlush(candidates);
    // Assert
    assertNotNull(candidates.getId());
    assertThat(candidates.getId()).isNotEqualTo(null);
    assertThat(candidates.getId()).isEqualTo(1L);
  }

  @Test
  @DisplayName("It should return candidate list")
  @DirtiesContext
  public void getCandidateTest() {
    candidateRepository.saveAndFlush(candidates);

    List<Candidates> list = candidateRepository.findAll();

    assertNotNull(list);
    assertEquals(1, list.size());
  }

  @Test
  @DisplayName("It should return candidate by id")
  public void getCandidateById() {
    candidateRepository.save(candidates);

    Candidates existingCandidate = candidateRepository.findById(candidates.getId()).get();

    assertNotNull(existingCandidate);
    assertEquals("neel42@gmail.com", existingCandidate.getEmail());
    assertEquals("789", existingCandidate.getCandidateCode());
    assertEquals(1L, existingCandidate.getId());
  }

  @Test
  @DisplayName("It should update the candidate")
  @Rollback(value = false)
  public void updateCandidateTest() {
    candidateRepository.save(candidates);

    candidates.setFirstName("Updated Neel");
    candidates.setEmail("neeljavia51@hotmail.com");
    Candidates updatedCandidate = candidateRepository.save(candidates);

    Optional<Candidates> foundCandidate =
        candidateRepository.findCandidateById(updatedCandidate.getId());

    assertTrue(foundCandidate.isPresent());
    assertEquals("Updated Neel", foundCandidate.get().getFirstName());
    assertEquals("neeljavia51@hotmail.com", foundCandidate.get().getEmail());
  }

  @Test
  @Rollback
  @DirtiesContext
  public void deleteCandidateById() {
    Candidates savedCandidate = candidateRepository.save(candidates);

    Long id = savedCandidate.getId();

    candidateRepository.deleteById(id);

    Optional<Candidates> deletedCandidate = candidateRepository.findById(id);
    assertFalse(deletedCandidate.isPresent());
  }

  @Test
  public void findByKeyword() {
    candidates2.setFirstName("Neel");

    candidateRepository.saveAll(Arrays.asList(candidates, candidates2));

    List<Candidates> foundCandidates =
        candidateRepository.findByKeyword("Neel".toLowerCase(), 0, 10);

    assertEquals(2, foundCandidates.size());
    assertEquals("Neel", foundCandidates.get(0).getFirstName());
  }

  @Test
  public void findByKeywordAndJobId() {
    candidates.setJob_id(1L);
    candidates2.setJob_id(2L);
    candidateRepository.saveAll(Arrays.asList(candidates, candidates2));

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findByKeywordAndJobId("Javia".toLowerCase(), 1L, null);

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
    assertEquals("Neel", foundCandidates.get(0).getFirstName());
    assertEquals(1L, foundCandidates.get(0).getJob_id());
  }

  @Test
  @DirtiesContext
  public void countCandidatesByJobId() {
    candidates.setJob_id(1L);
    candidateRepository.saveAll(Arrays.asList(candidates, candidates2));
    Long count = candidateRepository.countCandidatesByJobId(1L);
    assertEquals(0, count);
  }

  @Test
  public void
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition() {
    int minCtc = 6;
    int maxCtc = 16;
    int experience = 6;

    JobPosition jobPosition =
        JobPosition.builder()
            .jobTitle("Backend Developer")
            .id(4L)
            .jobStatus("Open")
            .jobDescription(null)
            .build();
    candidates.setJobPosition(jobPosition);
    candidateRepository.save(candidates);

    Page<Candidates> foundCandidates =
        candidateRepository
            .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition(
                new String[] {String.valueOf(new CurrentAddress("India", "Gujarat", "Vadodara"))},
                minCtc,
                maxCtc,
                experience,
                jobPosition,
                PageRequest.of(0, 10)); // Add Pageable parameter

    assertEquals(0, foundCandidates.getTotalElements());
  }

  @Test
  public void findByJobPosition() {
    JobPosition jobPosition =
        JobPosition.builder()
            .jobTitle("Backend Developer")
            .id(1L)
            .jobStatus("Open")
            .jobDescription(null)
            .build();
    candidates.setJobPosition(jobPosition);
    candidateRepository.save(candidates);

    List<Candidates> foundCandidates = candidateRepository.findByJobPosition(jobPosition);
    assertEquals(1, foundCandidates.size());
    assertEquals(candidates.getFirstName(), foundCandidates.get(0).getFirstName());
    assertEquals(
        candidates.getJobPosition().getJobTitle(),
        foundCandidates.get(0).getJobPosition().getJobTitle());
  }

  @Test
  public void findByJobPosition_Pageable() {
    JobPosition jobPosition =
        JobPosition.builder()
            .jobTitle("Backend Developer")
            .jobStatus("Open")
            .jobDescription(null)
            .hiringManagers(new String[] {"Singh", "Bassi"})
            .build();

    jobPositionRepository.save(jobPosition);

    candidates.setJobPosition(jobPosition);
    candidates2.setJobPosition(jobPosition);

    candidateRepository.saveAll(List.of(candidates, candidates2));

    PageRequest pageRequest = PageRequest.of(0, 10);

    Page<Candidates> candidatesPage =
        candidateRepository.findByJobPosition(jobPosition, pageRequest);

    assertEquals(2, candidatesPage.getContent().size());
    assertEquals(
        jobPosition.getJobTitle(),
        candidatesPage.getContent().get(0).getJobPosition().getJobTitle());
    assertEquals(candidates.getFirstName(), candidatesPage.getContent().get(0).getFirstName());
  }

  @Test
  public void findByCurrentCTCBetweenAndTotalExperienceGreaterThan() {
    candidateRepository.saveAll(Arrays.asList(candidates, candidates2));

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThan(
            8, 16, 10, PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
    assertEquals(candidates2.getFirstName(), foundCandidates.get(0).getFirstName());
  }

  @Test
  public void findByStage_Pageable() {
    String stage = "Interviewing";
    PageRequest pageRequest = PageRequest.of(0, 10);

    candidates.setStage(stage);
    candidates2.setStage(stage);

    candidateRepository.saveAll(List.of(candidates, candidates2));

    Page<Candidates> result = candidateRepository.findByStage(stage, pageRequest);

    assertEquals(2, result.getTotalElements());
    assertEquals(2, result.getContent().size());
    assertEquals(result.getContent().get(0).getFirstName(), candidates.getFirstName());
  }

  @Test
  public void findByStage() {
    String stage = "Shortlisted";
    candidates.setStage(stage);
    candidates2.setStage(stage);

    candidateRepository.saveAll(List.of(candidates, candidates2));

    List<Candidates> result = candidateRepository.findByStage(stage);

    assertEquals(2, result.size());
    assertEquals(result.get(1).getFirstName(), candidates2.getFirstName());
  }

  @Test
  public void findAllWithRoundTwoOrMore_Pageable() {
    candidates.setRound(1);
    candidates2.setRound(3);
    candidateRepository.saveAll(List.of(candidates, candidates2));

    PageRequest pageRequest = PageRequest.of(0, 10);

    Page<Candidates> result = candidateRepository.findAllWithRoundTwoOrMore(pageRequest);

    assertEquals(1, result.getTotalElements());
    assertEquals(1, result.getContent().size());
    assertEquals(result.getContent().get(0).getFirstName(), candidates2.getFirstName());
    assertEquals(result.getContent().get(0).getRound(), candidates2.getRound());
  }

  @Test
  public void findAllWithRoundTwoOrMore() {
    candidates.setRound(2);
    candidates2.setRound(4);
    candidateRepository.saveAll(List.of(candidates, candidates2));

    List<Candidates> result = candidateRepository.findAllWithRoundTwoOrMore();
    assertEquals(2, result.size());
  }

  @Test
  public void
      findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage() {
    candidates.setCurrentCTC((float) 10);
    candidates.setTotalExperience(3);
    candidates.setStage("Selected");

    candidates2.setCurrentCTC((float) 8);
    candidates2.setTotalExperience(5);
    candidates2.setStage("On Hold");

    candidateRepository.saveAll(List.of(candidates, candidates2));

    String[] locations = {"Vadodara", "Bangalore"};
    int minCtc = 9;
    int maxCtc = 15;
    int experience = 2;
    String stage = "Selected";

    Page<Candidates> foundCandidatesPage =
        candidateRepository
            .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                locations, minCtc, maxCtc, experience, stage, PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
    assertEquals(foundCandidates.get(0).getFirstName(), candidates.getFirstName());
  }

  @Test
  public void findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage() {
    candidates.setCurrentCTC((float) 12);
    candidates.setTotalExperience(8);
    candidates.setStage("Selected");

    candidates2.setCurrentCTC((float) 7);
    candidates2.setTotalExperience(7);
    candidates2.setStage("On Hold");

    candidateRepository.saveAll(List.of(candidates, candidates2));

    int minCtc = 6;
    int maxCtc = 9;
    int experience = 4;
    String stage = "On Hold";

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
            minCtc, maxCtc, experience, stage, PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
  }

  @Test
  public void findByKeywordAndStage_WithMatchingKeyword() {
    candidates.setStage("Selected");
    candidates2.setStage("On Hold");

    candidateRepository.saveAll(List.of(candidates, candidates2));

    String keyword = "Neel";
    // String keyword = "neel42@gmail.com";
    // String keyword = "Vadodara";
    // String keyword = "Java";

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findByKeywordAndStage(
            keyword.toLowerCase(), "Selected", PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
  }

  @Test
  public void findByKeywordAndStage_WithNonMatchingKeyword() {
    candidates.setStage("Selected");
    candidates2.setStage("On Hold");

    candidateRepository.saveAll(List.of(candidates, candidates2));

    String keyword = "Alex";

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findByKeywordAndStage(
            keyword.toLowerCase(), "Selected", PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(0, foundCandidates.size());
  }

  // D
  @Test
  public void findAllWithRoundTwoOrMoreAndKeyword_WithMatchingKeyword() {
    candidates.setRound(2);
    candidates2.setRound(3);

    candidateRepository.saveAll(List.of(candidates, candidates2));

    String keyword = "neel42@gmail.com";

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findAllWithRoundTwoOrMoreAndKeyword(
            keyword.toLowerCase(), PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(1, foundCandidates.size());
  }

  @Test
  public void findAllWithRoundTwoOrMoreAndKeyword_WithNonMatchingKeyword() {
    candidates.setRound(2);
    candidates2.setRound(3);

    candidateRepository.saveAll(List.of(candidates, candidates2));

    String keyword = "Joseph";

    Page<Candidates> foundCandidatesPage =
        candidateRepository.findAllWithRoundTwoOrMoreAndKeyword(
            keyword.toLowerCase(), PageRequest.of(0, 10));

    List<Candidates> foundCandidates = foundCandidatesPage.getContent();

    assertEquals(0, foundCandidates.size());
  }
}
