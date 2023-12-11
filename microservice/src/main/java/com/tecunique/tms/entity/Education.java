package com.tecunique.tms.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Education implements Serializable {
  private String highestDegree;
  private String specialization;

  @Temporal(TemporalType.DATE)
  private LocalDate yearOfAchievement;
}
