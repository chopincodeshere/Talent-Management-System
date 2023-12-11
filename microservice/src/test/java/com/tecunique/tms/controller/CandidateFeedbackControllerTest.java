package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.services.CandidateFeedbackService;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class CandidateFeedbackControllerTest {
  @Mock private CandidateFeedbackService candidateFeedbackService;

  @InjectMocks private CandidateFeedbackController candidateFeedbackController;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void getCandidateFeedbackByCandidateId() {
    Long candidateId = 1L;
    List<CandidateFeedback> feedbackList = new ArrayList<>();
    feedbackList.add(new CandidateFeedback());
    feedbackList.add(new CandidateFeedback());

    when(candidateFeedbackService.getCandidateFeedbackByCandidateId(candidateId))
        .thenReturn(feedbackList);

    ResponseEntity<List<CandidateFeedback>> response =
        candidateFeedbackController.getCandidateFeedbackByCandidateId(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(feedbackList, response.getBody());
    verify(candidateFeedbackService, times(1)).getCandidateFeedbackByCandidateId(candidateId);
  }

  @Test
  void getCandidateFeedbackByCandidateId_NoFeedbackForm() {
    Long candidateId = 1L;

    when(candidateFeedbackService.getCandidateFeedbackByCandidateId(candidateId))
        .thenReturn(new ArrayList<>());

    ResponseEntity<List<CandidateFeedback>> response =
        candidateFeedbackController.getCandidateFeedbackByCandidateId(candidateId);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(0, response.getBody().size());

    verify(candidateFeedbackService, times(1)).getCandidateFeedbackByCandidateId(candidateId);
    verifyNoMoreInteractions(candidateFeedbackService);
  }
}
