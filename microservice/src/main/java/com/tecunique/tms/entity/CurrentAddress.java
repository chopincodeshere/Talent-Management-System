package com.tecunique.tms.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Embeddable
public class CurrentAddress implements Serializable {
  private String currentCountry;
  private String currentState;
  private String currentCity;
}
