package com.tecunique.tms.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.CandidateFeedback;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTestContextBootstrapper;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.BootstrapWith;

@SpringBootTest
@ActiveProfiles("test")
@DataJpaTest
@BootstrapWith(value = SpringBootTestContextBootstrapper.class)
public class CandidateFeedbackRepositoryTest {
  @Autowired private CandidateFeedbackRepository candidateFeedbackRepository;

  @Autowired private TestEntityManager entityManager;

  private CandidateFeedback feedback1;
  private CandidateFeedback feedback2;

  @BeforeEach
  void setup() {
    feedback1 =
        CandidateFeedback.builder()
            .candidateName("Neel Javia")
            .dateOfInterview(LocalDate.of(2023, 5, 15))
            .positionAppliedFor("Java Software Developer")
            .interviewer("Jaydeep Chhasatia")
            .round(2)
            .educationalBackgroundRating(7)
            .workExperienceRating(7)
            .technicalSkillsRating(8)
            .communicationSkillsRating(8)
            .candidateInterestRating(8)
            .interpersonalSkillsRating(9)
            .overallRating(8)
            .comments("Good candidate")
            .result("Selected")
            .build();

    feedback2 =
        CandidateFeedback.builder()
            .candidateName("Jil Patel")
            .dateOfInterview(LocalDate.of(2022, 2, 25))
            .positionAppliedFor("QA Engineer")
            .interviewer("Ankur Gupta")
            .round(3)
            .educationalBackgroundRating(8)
            .workExperienceRating(8)
            .technicalSkillsRating(6)
            .communicationSkillsRating(7)
            .candidateInterestRating(8)
            .interpersonalSkillsRating(10)
            .overallRating(8)
            .comments("Excellent candidate")
            .result("On hold")
            .build();

    entityManager.persist(feedback1);
    entityManager.persist(feedback2);
    entityManager.flush();
  }

  @Test
  public void saveCandidateFeedback() {
    CandidateFeedback savedFeedback = candidateFeedbackRepository.save(feedback1);

    assertNotNull(savedFeedback.getId());

    CandidateFeedback receivedFeedback =
        candidateFeedbackRepository.findById(savedFeedback.getId()).orElse(null);

    assertNotNull(receivedFeedback);
    assertEquals(savedFeedback.getId(), receivedFeedback.getId());
    assertEquals(savedFeedback.getCandidateName(), receivedFeedback.getCandidateName());
  }
}
