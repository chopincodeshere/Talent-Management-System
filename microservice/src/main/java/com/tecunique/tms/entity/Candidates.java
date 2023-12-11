package com.tecunique.tms.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.*;

@Entity
// @Getter
// @Setter
// @ToString
@Data
@AllArgsConstructor(staticName = "build")
@NoArgsConstructor
@Builder
@Table(name = "candidates")
public class Candidates implements Serializable {
  @Id
  @Column(nullable = false, updatable = false, name = "candidate_id")
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotEmpty(message = "First Name should not be empty")
  @Pattern(regexp = "^([A-Z].*)$", message = "First letter of the First Name should be capital")
  private String firstName;

  @NotEmpty(message = "Last name should not be empty")
  @Pattern(regexp = "^([A-Z].*)$", message = "First letter of the Last Name should be capital")
  private String lastName;

  @NotEmpty(message = "Email cannot be empty")
  @Email(
      regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.(com|net|org|edu|in)$",
      message = "Format of email is not appropriate")
  private String email;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "currentAddress", column = @Column(name = "current_address")),
    @AttributeOverride(name = "permanentAddress", column = @Column(name = "permanent_address"))
  })
  private Address address;

  @NotEmpty(message = "Mobile number cannot be empty")
  // @Pattern(regexp = "^\\d{10}$", message = "Mobile number should be of 10 digits")
  private String mobilePhone;

  private String[] links;

  @OneToMany(mappedBy = "candidates", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @Builder.Default
  private List<Employment> employment = new ArrayList<>();

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "highestDegree", column = @Column(name = "highest_degree")),
    @AttributeOverride(name = "specialization", column = @Column(name = "specialization")),
    @AttributeOverride(name = "yearofAchievement", column = @Column(name = "year_of_achievement"))
  })
  private Education education;

  @NotEmpty(message = "Source cannot be empty")
  private String source;

  private String note;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "referred_fname", column = @Column(name = "referral_first_name")),
    @AttributeOverride(name = "referred_lname", column = @Column(name = "referral_last_name"))
  })
  private Referral referral;

  private Long job_id;

  @ManyToOne(
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH},
      fetch = FetchType.EAGER)
  @JsonIgnore
  private JobPosition jobPosition;

  @Lob
  // @NotEmpty(message = "Resume cannot be empty")
  private byte[] resume;

  @Column(nullable = false, updatable = false)
  private String candidateCode;

  @NotEmpty(message = "Key skills cannot be empty")
  private String[] keySkills;

  private String[] mayKnowSkills;

  @NotNull(message = "Total experience is required")
  private Integer totalExperience;

  @NotNull(message = "Current CTC cannot be null")
  @DecimalMin(value = "0.00")
  @DecimalMax(value = "999.99")
  private Float currentCTC;

  @NotNull(message = "Expected CTC cannot be null")
  @DecimalMin(value = "0.00")
  @DecimalMax(value = "999.99")
  private Float expectedCTC;

  @NotEmpty(message = "Current notice period cannot be empty")
  private String currentNoticePeriod;

  @NotEmpty(message = "Work mode cannot be empty")
  private String workMode;

  @NotNull(message = "Communication Skills cannot be null")
  @Min(value = 0, message = "Minimum rating should not be less than 0")
  @Max(value = 10, message = "Maximum rating should not be greater than 10")
  private Integer communicationSkills;

  private String stage;
  private Integer round;

  @Column(length = 1000)
  private String notesByInterviewer;

  @OneToMany(mappedBy = "candidates", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @Builder.Default
  private List<CandidateFeedback> candidateFeedback = new ArrayList<>();

  @Temporal(TemporalType.DATE)
  @JsonFormat(pattern = "yyyy-MM-dd", shape = JsonFormat.Shape.STRING)
  @Builder.Default
  private Date enrolledDate = new Date();

  public void setCandidateCode(String candidateCode) {
    this.candidateCode = candidateCode;
  }

  //  @Override
  //  public boolean equals(Object o) {
  //    if (this == o) return true;
  //    if (o == null || getClass() != o.getClass()) return false;
  //    Candidates that = (Candidates) o;
  //    return Objects.equals(id, that.id);
  //  }
  //
  //  @Override
  //  public int hashCode() {
  //    return Objects.hash(id);
  //  }
}
