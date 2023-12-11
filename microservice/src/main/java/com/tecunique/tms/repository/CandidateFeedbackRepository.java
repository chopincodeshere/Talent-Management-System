package com.tecunique.tms.repository;

import com.tecunique.tms.entity.CandidateFeedback;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateFeedbackRepository extends JpaRepository<CandidateFeedback, Long> {

  List<CandidateFeedback> findByCandidatesId(Long candidateId);
}
