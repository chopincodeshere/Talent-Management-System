package com.tecunique.tms.services;

import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.repository.CandidateFeedbackRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CandidateFeedbackService {

  private final CandidateFeedbackRepository candidateFeedbackRepository;

  public List<CandidateFeedback> getCandidateFeedbackByCandidateId(Long candidateId) {
    try {

      return candidateFeedbackRepository.findByCandidatesId(candidateId);
    } catch (Exception e) {
      throw e;
    }
  }
}
