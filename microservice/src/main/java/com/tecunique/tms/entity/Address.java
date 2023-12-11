package com.tecunique.tms.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class Address {
  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "currentCountry", column = @Column(name = "current_country")),
    @AttributeOverride(name = "currentState", column = @Column(name = "current_state")),
    @AttributeOverride(name = "currentCity", column = @Column(name = "current_city"))
  })
  private CurrentAddress currentAddress;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "permanentCountry", column = @Column(name = "permanent_country")),
    @AttributeOverride(name = "permanentState", column = @Column(name = "permanent_state")),
    @AttributeOverride(name = "permanentCity", column = @Column(name = "permanent_city"))
  })
  private PermanentAddress permanentAddress;
}
