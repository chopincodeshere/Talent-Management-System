package com.tecunique.tms.controller;

import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.services.CandidateFeedbackService;
import jakarta.annotation.security.RolesAllowed;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/candidates/candidateFeedback")
@AllArgsConstructor
public class CandidateFeedbackController {
  private final CandidateFeedbackService candidateFeedbackService;

  @GetMapping("/{candidateId}")
  @RolesAllowed({"ROLE_ADMIN", "ROLE_INTERVIEWER"})
  public ResponseEntity<List<CandidateFeedback>> getCandidateFeedbackByCandidateId(
      @PathVariable Long candidateId) {
    List<CandidateFeedback> candidateFeedbackList =
        candidateFeedbackService.getCandidateFeedbackByCandidateId(candidateId);
    return ResponseEntity.ok(candidateFeedbackList);
  }
}
