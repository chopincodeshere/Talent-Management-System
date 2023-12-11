package com.tecunique.tms.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.repository.CandidateFeedbackRepository;
import com.tecunique.tms.services.CandidateFeedbackService;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CandidateFeedbackServiceTest {
  private CandidateFeedbackService candidateFeedbackService;

  @Mock private CandidateFeedbackRepository candidateFeedbackRepository;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
    candidateFeedbackService = new CandidateFeedbackService(candidateFeedbackRepository);
  }

  @Test
  void getCandidateFeedbackByCandidateId() {
    Long candidateId = 1L;
    List<CandidateFeedback> expectedFeedbacks = new ArrayList<>();
    expectedFeedbacks.add(new CandidateFeedback());
    when(candidateFeedbackRepository.findByCandidatesId(candidateId)).thenReturn(expectedFeedbacks);

    List<CandidateFeedback> actualFeedbacks =
        candidateFeedbackService.getCandidateFeedbackByCandidateId(candidateId);

    assertEquals(expectedFeedbacks, actualFeedbacks);
    verify(candidateFeedbackRepository, times(1)).findByCandidatesId(candidateId);
  }

  @Test
  void getCandidateFeedbackByCandidateId_ExceptionThrown() {
    Long candidateId = 1L;
    when(candidateFeedbackRepository.findByCandidatesId(candidateId))
        .thenThrow(new RuntimeException("Error"));

    assertThrows(
        RuntimeException.class,
        () -> candidateFeedbackService.getCandidateFeedbackByCandidateId(candidateId));
    verify(candidateFeedbackRepository, times(1)).findByCandidatesId(candidateId);
  }
}
