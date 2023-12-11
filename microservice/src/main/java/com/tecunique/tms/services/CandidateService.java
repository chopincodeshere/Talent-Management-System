package com.tecunique.tms.services;

import com.tecunique.tms.dto.CandidateDetailsDto;
import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.entity.Referral;
import com.tecunique.tms.exceptions.ResourceNotFoundException;
import com.tecunique.tms.repository.CandidateRepository;
import com.tecunique.tms.repository.JobPositionRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CandidateService {
  private final CandidateRepository candidateRepository;
  private final JobPositionRepository jobPositionRepository;

  @Transactional
  public Candidates addCandidate(Candidates candidate) {
    try {
      candidate.setCandidateCode(UUID.randomUUID().toString());
      candidate.getEmployment().forEach(employment -> employment.setCandidates(candidate));
      candidate.getCandidateFeedback().forEach(feedback -> feedback.setCandidates(candidate));

      Long jobId = candidate.getJob_id();
      JobPosition jobPosition = jobPositionRepository.findJobPositionById(jobId);

      candidate.setJobPosition(jobPosition);

      return candidateRepository.save(candidate);
    } catch (Exception e) {
      throw e;
    }
  }

  public String getCandidateByName(Long id) {
    Optional<Candidates> candidateOptional = candidateRepository.findById(id);
    if (candidateOptional.isPresent()) {
      Candidates candidate = candidateOptional.get();
      return candidate.getFirstName() + " " + candidate.getLastName();
    }

    return null;
  }

  public Long getCandidateByPosition(Long id) {
    Optional<Candidates> candidateOptional = candidateRepository.findById(id);
    if (candidateOptional.isPresent()) {
      Candidates candidate = candidateOptional.get();
      return candidate.getJob_id();
    }

    return null;
  }

  public Candidates getCandidateById(Long id) throws ResourceNotFoundException {
    return candidateRepository
        .findById(id)
        .orElseThrow(
            () -> new ResourceNotFoundException("Candidate not found for this id :: " + id));
  }

  public CandidateFeedback addCandidateFeedback(
      Long candidateId, CandidateFeedback candidateFeedback) {
    Candidates candidate = getCandidateById(candidateId); // Retrieve the candidate by ID
    candidateFeedback.setCandidates(candidate); // Set the candidate for the feedback
    candidateFeedback.setPositionAppliedFor(candidate.getJobPosition().getJobTitle());
    candidate
        .getCandidateFeedback()
        .add(candidateFeedback); // Add the feedback to the candidate's feedback list
    candidateRepository.save(candidate); // Save the candidate with the updated feedback

    return candidateFeedback;
  }

  public List<Candidates> findAllCandidates() {
    try {
      return candidateRepository.findAll();
    } catch (Exception e) {
      throw e;
    }
  }

  public Long getTotalNumberOfRecords() {
    try {
      return candidateRepository.count();
    } catch (Exception e) {
      throw e;
    }
  }

  public Integer getNumberOfShortlistedCandidates() {
    try {
      return candidateRepository.findAllWithRoundTwoOrMore().size();
    } catch (Exception e) {
      throw e;
    }
  }

  public Integer getNumberOfHiredCandidates() {
    try {
      return candidateRepository.findByStage("Hired").size();
    } catch (Exception e) {
      throw e;
    }
  }

  public Integer getNumberOfOnHoldCandidates() {
    try {
      return candidateRepository.findByStage("On Hold").size();
    } catch (Exception e) {
      throw e;
    }
  }

  public Integer getNumberOfRejectedCandidates() {
    try {
      return candidateRepository.findByStage("Rejected").size();
    } catch (Exception e) {
      throw e;
    }
  }

  public Integer getNumberOfInactiveCandidates() {
    try {
      return candidateRepository.findByStage("Inactive").size();
    } catch (Exception e) {
      throw e;
    }
  }

  public List<CandidateDetailsDto> getAllCandidates(
      Integer pageNumber, Integer pageSize, String sortField, Sort.Direction sortOrder) {
    try {
      PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

      Page<Candidates> pageCandidates = this.candidateRepository.findAll(pageRequest);
      List<Candidates> allCandidates = pageCandidates.getContent();

      return allCandidates.stream().map(this::convertEntityToDto).collect(Collectors.toList());
    } catch (Exception e) {
      e.printStackTrace();
      throw e;
    }
  }

  public List<CandidateDetailsDto> searchCandidates(String[] keywords, int page, int size) {
    try {
      List<CandidateDetailsDto> candidateDto = new ArrayList<>();
      List<Candidates> candidates;

      if (keywords.length == 0) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Candidates> candidatePage = candidateRepository.findAll(pageable);
        candidates = candidatePage.getContent();
      } else {
        // Calculate the offset manually based on the page and size
        int offset = page * size;
        // Search for candidates based on the keywords and offset
        candidates = candidateRepository.findByKeyword(keywords[0], offset, size);
        for (int i = 1; i < keywords.length; i++) {
          List<Candidates> keywordCandidates =
              candidateRepository.findByKeyword(keywords[i], offset, size);
          candidates.addAll(keywordCandidates);
        }
      }

      for (Candidates candidate : candidates) {
        candidateDto.add(convertEntityToDto(candidate));
      }

      return candidateDto;
    } catch (Exception e) {
      System.out.println(e);
      throw e;
    }
  }

  public void addInterviewerNote(Long candidateId, String note) {
    Optional<Candidates> optionalCandidate = candidateRepository.findById(candidateId);

    if (optionalCandidate.isPresent()) {
      Candidates candidate = optionalCandidate.get();
      candidate.setNotesByInterviewer(note);
      candidateRepository.save(candidate);
    } else {
      throw new EntityNotFoundException("Candidate not found");
    }
  }

  public void updateRound(Long candidateId, Integer round) {
    Optional<Candidates> optionalCandidate = candidateRepository.findById(candidateId);

    if (optionalCandidate.isPresent()) {
      Candidates candidate = optionalCandidate.get();
      candidate.setRound(round);

      candidateRepository.save(candidate);
    } else {
      throw new EntityNotFoundException("Candidate not found");
    }
  }

  public void updateStage(Long candidateId, String stage) {
    Optional<Candidates> optionalCandidate = candidateRepository.findById(candidateId);

    if (optionalCandidate.isPresent()) {
      Candidates candidate = optionalCandidate.get();
      candidate.setStage(stage);

      candidateRepository.save(candidate);
    } else {
      throw new EntityNotFoundException("Candidate not found");
    }
  }

  public Page<CandidateDetailsDto> findCandidatesByLocationAndCtcAndExperience(
      String[] location, Integer minCtc, Integer maxCtc, Integer experience, int page, int size) {
    try {
      Pageable pageable = PageRequest.of(page, size);
      Page<Candidates> candidatesPage;
      if (location != null && location.length > 0) {
        candidatesPage =
            candidateRepository
                .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThan(
                    location,
                    minCtc != null ? minCtc : 0,
                    maxCtc != null ? maxCtc : 100,
                    experience != null ? experience : 0,
                    pageable);
      } else {
        candidatesPage =
            candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThan(
                minCtc != null ? minCtc : 0,
                maxCtc != null ? maxCtc : 100,
                experience != null ? experience : 0,
                pageable);
      }
      return candidatesPage.map(this::convertEntityToDto);
    } catch (Exception e) {
      throw new ResourceNotFoundException("Candidates not found");
    }
  }

  public Page<CandidateDetailsDto> findCandidatesByLocationAndCtcAndExperienceAndJobPosition(
      String[] location,
      Integer minCtc,
      Integer maxCtc,
      Integer experience,
      JobPosition jobPosition,
      Pageable pageable) {
    try {
      Page<Candidates> candidatePage;

      if (location != null && location.length > 0) {
        candidatePage =
            candidateRepository
                .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition(
                    location,
                    minCtc != null ? minCtc : 0,
                    maxCtc != null ? maxCtc : 100,
                    experience != null ? experience : 0,
                    jobPosition,
                    pageable);
      } else {
        candidatePage =
            candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndJobPosition(
                minCtc != null ? minCtc : 0,
                maxCtc != null ? maxCtc : 100,
                experience != null ? experience : 0,
                jobPosition,
                pageable);
      }

      if (candidatePage.isEmpty()) {
        throw new ResourceNotFoundException("No candidates found for the given filters.");
      }

      List<CandidateDetailsDto> candidateDto = new ArrayList<>();

      for (Candidates candidate : candidatePage.getContent()) {
        candidateDto.add(convertEntityToDto(candidate));
      }

      return new PageImpl<>(candidateDto, pageable, candidatePage.getTotalElements());
    } catch (Exception e) {
      throw e;
    }
  }

  public List<CandidateDetailsDto> getCandidatesByJobPosition(
      JobPosition jobPosition,
      Integer pageNumber,
      Integer pageSize,
      String sortField,
      Sort.Direction sortOrder)
      throws Exception {
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    Page<Candidates> pageCandidates =
        this.candidateRepository.findByJobPosition(jobPosition, pageRequest);
    List<Candidates> allCandidates = pageCandidates.getContent();

    return allCandidates.stream().map(this::convertEntityToDto).collect(Collectors.toList());
  }

  public List<CandidateDetailsDto> findByKeywordAndJobId(
      String[] keywords, Long jobId, int page, int size) {
    try {
      List<CandidateDetailsDto> candidateDto = new ArrayList<>();
      Pageable pageable = PageRequest.of(page, size);
      Page<Candidates> candidatesPage;

      if (keywords == null || keywords.length == 0) {
        candidatesPage =
            candidateRepository.findByJobPosition(
                jobPositionRepository.findById(jobId).get(), pageable);

        for (Candidates candidate : candidatesPage) {
          candidateDto.add(convertEntityToDto(candidate));
        }
      } else {
        for (String keyword : keywords) {
          candidatesPage = candidateRepository.findByKeywordAndJobId(keyword, jobId, pageable);
          List<Candidates> candidates = candidatesPage.getContent();
          for (Candidates candidate : candidates) {
            candidateDto.add(convertEntityToDto(candidate));
          }
        }
      }

      return candidateDto;
    } catch (Exception e) {
      throw new ResourceNotFoundException("Candidate not found");
    }
  }

  public Long getNumberOfCandidatesByJobId(Long jobId) {
    return candidateRepository.countCandidatesByJobId(jobId);
  }

  public List<CandidateDetailsDto> getCandidatesWithStage(
      Integer key,
      Integer pageNumber,
      Integer pageSize,
      String sortField,
      Sort.Direction sortOrder) {
    PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sortOrder, sortField);

    switch (key) {
      case 3 -> {
        Page<Candidates> pageCandidatesWithShortlisted =
            this.candidateRepository.findAllWithRoundTwoOrMore(pageRequest);
        List<Candidates> allCandidatesWithShortlisted = pageCandidatesWithShortlisted.getContent();
        return allCandidatesWithShortlisted.stream()
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
      }
      case 4 -> {
        Page<Candidates> pageCandidatesWithHired =
            this.candidateRepository.findByStage("Hired", pageRequest);
        List<Candidates> allCandidatesWithHired = pageCandidatesWithHired.getContent();
        return allCandidatesWithHired.stream()
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
      }
      case 5 -> {
        Page<Candidates> pageCandidatesWithOnHold =
            this.candidateRepository.findByStage("On Hold", pageRequest);
        List<Candidates> allCandidatesWithOnHold = pageCandidatesWithOnHold.getContent();
        return allCandidatesWithOnHold.stream()
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
      }
      case 6 -> {
        Page<Candidates> pageCandidatesWithRejected =
            this.candidateRepository.findByStage("Rejected", pageRequest);
        List<Candidates> allCandidatesWithRejected = pageCandidatesWithRejected.getContent();
        return allCandidatesWithRejected.stream()
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
      }
      case 7 -> {
        Page<Candidates> pageCandidatesWithInactive =
            this.candidateRepository.findByStage("Inactive", pageRequest);
        List<Candidates> allCandidatesWithInactive = pageCandidatesWithInactive.getContent();
        return allCandidatesWithInactive.stream()
            .map(this::convertEntityToDto)
            .collect(Collectors.toList());
      }
      default -> {
        Page<Candidates> pageAllCandidates = this.candidateRepository.findAll(pageRequest);
        List<Candidates> allCandidates = pageAllCandidates.getContent();
        return allCandidates.stream().map(this::convertEntityToDto).collect(Collectors.toList());
      }
    }
  }

  public void deleteCandidate(Long id) {
    try {
      Candidates candidate =
          candidateRepository
              .findById(id)
              .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

      // Detach the candidate from the job position
      JobPosition jobPosition = candidate.getJobPosition();
      if (jobPosition != null) {
        jobPosition.getCandidates().remove(candidate);
        candidate.setJobPosition(null);
      }

      // Delete the candidate
      candidateRepository.deleteById(id);
    } catch (Exception e) {
      throw e;
    }
  }

  public Candidates updateCandidate(Long id, Candidates candidateDetails)
      throws ResourceNotFoundException {
    Candidates candidate =
        candidateRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Candidate not found for this id :: " + id));

    candidate.setFirstName(candidateDetails.getFirstName());
    candidate.setLastName(candidateDetails.getLastName());
    candidate.setEmail(candidateDetails.getEmail());
    candidate.setAddress(candidateDetails.getAddress());
    candidate.setMobilePhone(candidateDetails.getMobilePhone());
    candidate.setLinks(candidateDetails.getLinks());
    candidate.setEmployment(candidateDetails.getEmployment());
    candidate.setEducation(candidateDetails.getEducation());
    candidate.setSource(candidateDetails.getSource());
    candidate.setReferral(candidateDetails.getReferral());
    candidate.setNote(candidateDetails.getNote());
    candidate.setKeySkills(candidateDetails.getKeySkills());
    candidate.setMayKnowSkills(candidateDetails.getMayKnowSkills());
    candidate.setTotalExperience(candidateDetails.getTotalExperience());
    candidate.setCurrentCTC(candidateDetails.getCurrentCTC());
    candidate.setExpectedCTC(candidateDetails.getExpectedCTC());
    candidate.setCurrentNoticePeriod(candidateDetails.getCurrentNoticePeriod());
    candidate.setWorkMode(candidateDetails.getWorkMode());
    candidate.setCommunicationSkills(candidateDetails.getCommunicationSkills());
    candidate.setRound(candidateDetails.getRound());
    candidate.setResume(candidateDetails.getResume());

    // Update the Candidates reference in Employment objects
    candidate.getEmployment().forEach(employment -> employment.setCandidates(candidate));

    // Check if jobPosition is not null before assigning it to candidate
    JobPosition jobPosition = candidateDetails.getJobPosition();
    if (jobPosition != null) {
      candidate.setJobPosition(jobPosition);
    }

    return candidateRepository.save(candidate);
  }

  public CandidateDetailsDto convertEntityToDto(Candidates candidate) {
    CandidateDetailsDto candidateDetailsDto = new CandidateDetailsDto();
    candidateDetailsDto.setId(candidate.getId());
    candidateDetailsDto.setFirstName(candidate.getFirstName());
    candidateDetailsDto.setEmail(candidate.getEmail());
    candidateDetailsDto.setAddress(candidate.getAddress());
    candidateDetailsDto.setSkills(candidate.getKeySkills());
    candidateDetailsDto.setMayKnowSkills(candidate.getMayKnowSkills());
    candidateDetailsDto.setLastName(candidate.getLastName());
    candidateDetailsDto.setCandidateCode(candidate.getCandidateCode());
    candidateDetailsDto.setMobilePhone(candidate.getMobilePhone());
    candidateDetailsDto.setSource(candidate.getSource());
    candidateDetailsDto.setEnrolledDate(candidate.getEnrolledDate());
    candidateDetailsDto.setEducation(candidate.getEducation());
    candidateDetailsDto.setJobPosition(candidate.getJobPosition());
    candidateDetailsDto.setWorkMode(candidate.getWorkMode());
    candidateDetailsDto.setCurrentCTC(candidate.getCurrentCTC());
    candidateDetailsDto.setExpectedCTC(candidate.getExpectedCTC());
    candidateDetailsDto.setCurrentNoticePeriod(candidate.getCurrentNoticePeriod());
    candidateDetailsDto.setTotalExperience(candidate.getTotalExperience());
    candidateDetailsDto.setRound(candidate.getRound());
    candidateDetailsDto.setStage(candidate.getStage());

    return candidateDetailsDto;
  }

  public List<CandidateDetailsDto> getCandidatesWithStageAndKeywords(
      String[] keywords, Integer key, int page, int size) {
    try {
      List<CandidateDetailsDto> candidateDto = new ArrayList<>();
      Page<Candidates> candidatesPage;

      if (keywords == null || keywords.length == 0) {
        if (getStageByKey(key).equals("Shortlisted")) {
          candidatesPage =
              candidateRepository.findAllWithRoundTwoOrMore(PageRequest.of(page, size));

          for (Candidates candidate : candidatesPage.getContent()) {
            candidateDto.add(convertEntityToDto(candidate));
          }
        } else {
          candidatesPage =
              candidateRepository.findByStage(getStageByKey(key), PageRequest.of(page, size));

          for (Candidates candidate : candidatesPage.getContent()) {
            candidateDto.add(convertEntityToDto(candidate));
          }
        }
      } else {
        for (String keyword : keywords) {
          if (getStageByKey(key).equals("Shortlisted")) {
            candidatesPage =
                candidateRepository.findAllWithRoundTwoOrMoreAndKeyword(
                    keyword, PageRequest.of(page, size));

            for (Candidates candidate : candidatesPage.getContent()) {
              candidateDto.add(convertEntityToDto(candidate));
            }
          } else {
            candidatesPage =
                candidateRepository.findByKeywordAndStage(
                    keyword, getStageByKey(key), PageRequest.of(page, size));

            for (Candidates candidate : candidatesPage.getContent()) {
              candidateDto.add(convertEntityToDto(candidate));
            }
          }
        }
      }

      return candidateDto;
    } catch (Exception e) {
      throw new ResourceNotFoundException("Candidate not found");
    }
  }

  private String getStageByKey(Integer key) {
    return switch (key) {
      case 3 -> "Shortlisted";
      case 4 -> "Hired";
      case 5 -> "On Hold";
      case 6 -> "Rejected";
      case 7 -> "Inactive";
      default -> "";
    };
  }

  public Page<CandidateDetailsDto> findCandidatesByLocationAndCtcAndExperienceAndStage(
      String[] location,
      Integer minCtc,
      Integer maxCtc,
      Integer experience,
      Integer key,
      Pageable pageable) {
    Page<Candidates> candidatesPage;
    Page<CandidateDetailsDto> candidateDtoPage;

    switch (key) {
      case 3 -> {
        if (location != null && location.length > 0) {
          candidatesPage =
              candidateRepository
                  .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndTwoOrMore(
                      location,
                      minCtc != null ? minCtc : 0,
                      maxCtc != null ? maxCtc : 100,
                      experience != null ? experience : 0,
                      pageable);
        } else {
          candidatesPage =
              candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndTwoOrMore(
                  minCtc != null ? minCtc : 0,
                  maxCtc != null ? maxCtc : 100,
                  experience != null ? experience : 0,
                  pageable);
        }
      }
      case 4 -> {
        if (location != null && location.length > 0) {
          candidatesPage =
              candidateRepository
                  .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                      location,
                      minCtc != null ? minCtc : 0,
                      maxCtc != null ? maxCtc : 100,
                      experience != null ? experience : 0,
                      "Hired",
                      pageable);
        } else {
          candidatesPage =
              candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                  minCtc != null ? minCtc : 0,
                  maxCtc != null ? maxCtc : 100,
                  experience != null ? experience : 0,
                  "Hired",
                  pageable);
        }
      }
      case 5 -> {
        if (location != null && location.length > 0) {
          candidatesPage =
              candidateRepository
                  .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                      location,
                      minCtc != null ? minCtc : 0,
                      maxCtc != null ? maxCtc : 100,
                      experience != null ? experience : 0,
                      "On Hold",
                      pageable);
        } else {
          candidatesPage =
              candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                  minCtc != null ? minCtc : 0,
                  maxCtc != null ? maxCtc : 100,
                  experience != null ? experience : 0,
                  "On Hold",
                  pageable);
        }
      }
      case 6 -> {
        if (location != null && location.length > 0) {
          candidatesPage =
              candidateRepository
                  .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                      location,
                      minCtc != null ? minCtc : 0,
                      maxCtc != null ? maxCtc : 100,
                      experience != null ? experience : 0,
                      "Rejected",
                      pageable);
        } else {
          candidatesPage =
              candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                  minCtc != null ? minCtc : 0,
                  maxCtc != null ? maxCtc : 100,
                  experience != null ? experience : 0,
                  "Rejected",
                  pageable);
        }
      }
      case 7 -> {
        if (location != null && location.length > 0) {
          candidatesPage =
              candidateRepository
                  .findByAddressCurrentAddressCurrentCityInAndCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                      location,
                      minCtc != null ? minCtc : 0,
                      maxCtc != null ? maxCtc : 100,
                      experience != null ? experience : 0,
                      "Inactive",
                      pageable);
        } else {
          candidatesPage =
              candidateRepository.findByCurrentCTCBetweenAndTotalExperienceGreaterThanAndStage(
                  minCtc != null ? minCtc : 0,
                  maxCtc != null ? maxCtc : 100,
                  experience != null ? experience : 0,
                  "Inactive",
                  pageable);
        }
      }
      default -> candidatesPage = new PageImpl<>(Collections.emptyList());
    }

    candidateDtoPage = candidatesPage.map(this::convertEntityToDto);
    return candidateDtoPage;
  }

  public byte[] getResumeFileById(Long id) throws ResourceNotFoundException {
    Candidates candidate =
        candidateRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Candidate not found for this id :: " + id));

    return candidate.getResume();
  }

  public static class CandidatesExcelExporter {

    public static ByteArrayOutputStream exportDataToExcel(List<Candidates> data)
        throws IOException {
      Workbook workbook = new XSSFWorkbook();
      Sheet sheet = workbook.createSheet("All Candidate's Data");

      CellStyle headerStyle = workbook.createCellStyle();
      Font headerFont = workbook.createFont();
      headerFont.setBold(true);
      headerFont.setFontHeightInPoints((short) 14);
      headerFont.setFontName("Arial");
      headerFont.setColor(IndexedColors.BLACK.getIndex());
      headerStyle.setFillForegroundColor(IndexedColors.TURQUOISE.getIndex());
      headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
      headerStyle.setFont(headerFont);
      headerStyle.setAlignment(HorizontalAlignment.CENTER);

      Row headerRow = sheet.createRow(0);
      headerRow.createCell(0).setCellValue("Candidate ID");
      headerRow.createCell(1).setCellValue("First Name");
      headerRow.createCell(2).setCellValue("Last Name");
      headerRow.createCell(3).setCellValue("Email");
      headerRow.createCell(4).setCellValue("Mobile Number");
      headerRow.createCell(5).setCellValue("Current Country");
      headerRow.createCell(6).setCellValue("Current State");
      headerRow.createCell(7).setCellValue("Current City");
      headerRow.createCell(8).setCellValue("Permanent Country");
      headerRow.createCell(9).setCellValue("Permanent State");
      headerRow.createCell(10).setCellValue("Permanent City");
      headerRow.createCell(11).setCellValue("Highest Degree");
      headerRow.createCell(12).setCellValue("Specialization");
      headerRow.createCell(13).setCellValue("Year of Achievement");
      headerRow.createCell(14).setCellValue("Source");
      headerRow.createCell(15).setCellValue("Referred by: First Name");
      headerRow.createCell(16).setCellValue("Referred by: Last Name");
      headerRow.createCell(17).setCellValue("Key Skills");
      headerRow.createCell(18).setCellValue("May know Skills");
      headerRow.createCell(19).setCellValue("Total Experience");
      headerRow.createCell(20).setCellValue("Current CTC");
      headerRow.createCell(21).setCellValue("Expected CTC");
      headerRow.createCell(22).setCellValue("Current Notice Period");
      headerRow.createCell(23).setCellValue("Work Mode");
      headerRow.createCell(24).setCellValue("Communication Skills");
      headerRow.createCell(25).setCellValue("Candidate Code");
      headerRow.createCell(26).setCellValue("Enrolled Date");
      headerRow.createCell(27).setCellValue("Links");
      headerRow.createCell(28).setCellValue("Note by Candidates");
      headerRow.createCell(29).setCellValue("Notes By Interviewer");
      headerRow.createCell(30).setCellValue("Job Id");
      headerRow.createCell(31).setCellValue("Position Applied For");

      for (Cell cell : headerRow) {
        cell.setCellStyle(headerStyle);
      }

      CellStyle dataCellStyle = workbook.createCellStyle();
      dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

      DataFormat dataFormat = workbook.createDataFormat();
      CellStyle dateCellStyle = workbook.createCellStyle();
      dateCellStyle.setDataFormat(dataFormat.getFormat("yyyy-mm-dd"));
      dateCellStyle.setAlignment(HorizontalAlignment.CENTER);

      int rowNum = 1;
      for (Candidates candidates : data) {
        Row dataRow = sheet.createRow(rowNum++);

        Cell cell1 = dataRow.createCell(0);
        cell1.setCellValue(candidates.getId());
        cell1.setCellStyle(dataCellStyle);

        Cell cell2 = dataRow.createCell(1);
        cell2.setCellValue(candidates.getFirstName());
        cell2.setCellStyle(dataCellStyle);

        Cell cell3 = dataRow.createCell(2);
        cell3.setCellValue(candidates.getLastName());
        cell3.setCellStyle(dataCellStyle);

        Cell cell4 = dataRow.createCell(3);
        cell4.setCellValue(candidates.getEmail());
        cell4.setCellStyle(dataCellStyle);

        Cell cell5 = dataRow.createCell(4);
        cell5.setCellValue(candidates.getMobilePhone());
        cell5.setCellStyle(dataCellStyle);

        Cell cell6 = dataRow.createCell(5);
        cell6.setCellValue(candidates.getAddress().getCurrentAddress().getCurrentCountry());
        cell6.setCellStyle(dataCellStyle);

        Cell cell7 = dataRow.createCell(6);
        cell7.setCellValue(candidates.getAddress().getCurrentAddress().getCurrentState());
        cell7.setCellStyle(dataCellStyle);

        Cell cell8 = dataRow.createCell(7);
        cell8.setCellValue(candidates.getAddress().getCurrentAddress().getCurrentCity());
        cell8.setCellStyle(dataCellStyle);

        Cell cell9 = dataRow.createCell(8);
        cell9.setCellValue(candidates.getAddress().getPermanentAddress().getPermanentCountry());
        cell9.setCellStyle(dataCellStyle);

        Cell cell10 = dataRow.createCell(9);
        cell10.setCellValue(candidates.getAddress().getPermanentAddress().getPermanentState());
        cell10.setCellStyle(dataCellStyle);

        Cell cell11 = dataRow.createCell(10);
        cell11.setCellValue(candidates.getAddress().getPermanentAddress().getPermanentCity());
        cell11.setCellStyle(dataCellStyle);

        Cell cell12 = dataRow.createCell(11);
        cell12.setCellValue(candidates.getEducation().getHighestDegree());
        cell12.setCellStyle(dataCellStyle);

        Cell cell13 = dataRow.createCell(12);
        cell13.setCellValue(candidates.getEducation().getSpecialization());
        cell13.setCellStyle(dataCellStyle);

        Cell cell14 = dataRow.createCell(13);
        cell14.setCellValue(candidates.getEducation().getYearOfAchievement());
        cell14.setCellStyle(dateCellStyle);

        Cell cell15 = dataRow.createCell(14);
        cell15.setCellValue(candidates.getSource());
        cell15.setCellStyle(dataCellStyle);

        Cell cell16 = dataRow.createCell(15);
        Referral referral = candidates.getReferral();
        if (referral != null) {
          cell16.setCellValue(referral.getReferred_fname());
        } else {
          cell16.setCellValue(""); // Set an empty string as the cell value when referral is null
        }
        cell16.setCellStyle(dataCellStyle);

        Cell cell17 = dataRow.createCell(16);
        if (referral != null) {
          cell17.setCellValue(referral.getReferred_lname());
        } else {
          cell17.setCellValue(""); // Set an empty string as the cell value when referral is null
        }
        cell17.setCellStyle(dataCellStyle);

        Cell cell18 = dataRow.createCell(17);
        cell18.setCellValue(Arrays.toString(candidates.getKeySkills()));
        cell18.setCellStyle(dataCellStyle);

        Cell cell19 = dataRow.createCell(18);
        cell19.setCellValue(Arrays.toString(candidates.getMayKnowSkills()));
        cell19.setCellStyle(dataCellStyle);

        Cell cell20 = dataRow.createCell(19);
        cell20.setCellValue(candidates.getTotalExperience());
        cell20.setCellStyle(dataCellStyle);

        Cell cell21 = dataRow.createCell(20);
        cell21.setCellValue(candidates.getCurrentCTC());
        cell21.setCellStyle(dataCellStyle);

        Cell cell22 = dataRow.createCell(21);
        cell22.setCellValue(candidates.getExpectedCTC());
        cell22.setCellStyle(dataCellStyle);

        Cell cell23 = dataRow.createCell(22);
        cell23.setCellValue(candidates.getCurrentNoticePeriod());
        cell23.setCellStyle(dataCellStyle);

        Cell cell24 = dataRow.createCell(23);
        cell24.setCellValue(candidates.getWorkMode());
        cell24.setCellStyle(dataCellStyle);

        Cell cell25 = dataRow.createCell(24);
        cell25.setCellValue(candidates.getCommunicationSkills());
        cell25.setCellStyle(dataCellStyle);

        Cell cell26 = dataRow.createCell(25);
        cell26.setCellValue(candidates.getCandidateCode());
        cell26.setCellStyle(dataCellStyle);

        Cell cell27 = dataRow.createCell(26);
        cell27.setCellValue(candidates.getEnrolledDate());
        cell27.setCellStyle(dateCellStyle);

        Cell cell28 = dataRow.createCell(27);
        cell28.setCellValue(Arrays.toString(candidates.getLinks()));
        cell28.setCellStyle(dataCellStyle);

        Cell cell29 = dataRow.createCell(28);
        cell29.setCellValue(candidates.getNote());
        cell29.setCellStyle(dataCellStyle);

        Cell cell30 = dataRow.createCell(29);
        cell30.setCellValue(candidates.getNotesByInterviewer());
        cell30.setCellStyle(dataCellStyle);

        Cell cell31 = dataRow.createCell(30);
        cell31.setCellValue(candidates.getJob_id());
        cell31.setCellStyle(dataCellStyle);

        Cell cell32 = dataRow.createCell(31);
        cell32.setCellValue(candidates.getJobPosition().getJobTitle());
        cell32.setCellStyle(dataCellStyle);

        for (int i = 0; i < dataRow.getLastCellNum(); i++) {
          sheet.autoSizeColumn(i, true);
        }
      }

      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      workbook.write(outputStream);
      workbook.close();

      return outputStream;
    }

    public static ByteArrayOutputStream exportJobPositionToExcel(List<JobPosition> jobPositions)
        throws IOException {
      Workbook workbook = new XSSFWorkbook();
      Sheet sheet = workbook.createSheet("Job Positions");

      CellStyle headerStyle = workbook.createCellStyle();
      Font headerFont = workbook.createFont();
      headerFont.setBold(true);
      headerFont.setFontHeightInPoints((short) 14);
      headerFont.setFontName("Arial");
      headerFont.setColor(IndexedColors.BLACK.getIndex());
      headerStyle.setFillForegroundColor(IndexedColors.TURQUOISE.getIndex());
      headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
      headerStyle.setFont(headerFont);
      headerStyle.setAlignment(HorizontalAlignment.CENTER);

      Row headerRow = sheet.createRow(0);
      headerRow.createCell(0).setCellValue("ID");
      headerRow.createCell(1).setCellValue("Job Title");
      headerRow.createCell(2).setCellValue("Hiring Managers");
      headerRow.createCell(3).setCellValue("Job Status");
      headerRow.createCell(4).setCellValue("No. of Candidates");

      for (Cell cell : headerRow) {
        cell.setCellStyle(headerStyle);
      }

      CellStyle dataCellStyle = workbook.createCellStyle();
      dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

      int rowNum = 1;
      for (JobPosition jobPosition : jobPositions) {
        Row dataRow = sheet.createRow(rowNum++);
        Cell cell1 = dataRow.createCell(0);
        cell1.setCellValue(jobPosition.getId());
        cell1.setCellStyle(dataCellStyle);

        Cell cell2 = dataRow.createCell(1);
        cell2.setCellValue(jobPosition.getJobTitle());
        cell2.setCellStyle(dataCellStyle);

        Cell cell3 = dataRow.createCell(2);
        cell3.setCellValue(String.join(", ", jobPosition.getHiringManagers()));
        cell3.setCellStyle(dataCellStyle);

        Cell cell4 = dataRow.createCell(3);
        cell4.setCellValue(jobPosition.getJobStatus());
        cell4.setCellStyle(dataCellStyle);

        Cell cell5 = dataRow.createCell(4);
        cell5.setCellValue(jobPosition.getCandidates().toArray().length);
        cell5.setCellStyle(dataCellStyle);
      }

      for (int i = 0; i < headerRow.getLastCellNum(); i++) {
        sheet.autoSizeColumn(i, true);
      }

      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      workbook.write(outputStream);
      workbook.close();

      return outputStream;
    }

    public static ByteArrayOutputStream exportCandidateFeedbackToExcel(
        List<CandidateFeedback> feedbackList) throws IOException {
      Workbook workbook = new XSSFWorkbook();
      Sheet sheet = workbook.createSheet("Candidate Feedback");

      CellStyle headerStyle = workbook.createCellStyle();
      Font headerFont = workbook.createFont();
      headerFont.setBold(true);
      headerFont.setFontHeightInPoints((short) 14);
      headerFont.setFontName("Arial");
      headerFont.setColor(IndexedColors.BLACK.getIndex());
      headerStyle.setFillForegroundColor(IndexedColors.TURQUOISE.getIndex());
      headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
      headerStyle.setFont(headerFont);
      headerStyle.setAlignment(HorizontalAlignment.CENTER);

      Row headerRow = sheet.createRow(0);
      headerRow.createCell(0).setCellValue("Feedback ID");
      headerRow.createCell(1).setCellValue("Candidate Name");
      headerRow.createCell(2).setCellValue("Date of Interview");
      headerRow.createCell(3).setCellValue("Position Applied For");
      headerRow.createCell(4).setCellValue("Interviewer");
      headerRow.createCell(5).setCellValue("Educational Background Rating");
      headerRow.createCell(6).setCellValue("Work Experience Rating");
      headerRow.createCell(7).setCellValue("Technical Skills Rating");
      headerRow.createCell(8).setCellValue("Communication Skills Rating");
      headerRow.createCell(9).setCellValue("Candidate Interests Rating");
      headerRow.createCell(10).setCellValue("Interpersonal Skills Rating");
      headerRow.createCell(11).setCellValue("Overall Rating");
      headerRow.createCell(12).setCellValue("Comments");
      headerRow.createCell(13).setCellValue("Result");

      for (Cell cell : headerRow) {
        cell.setCellStyle(headerStyle);
      }

      CellStyle dataCellStyle = workbook.createCellStyle();
      dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

      DataFormat dataFormat = workbook.createDataFormat();
      CellStyle dateCellStyle = workbook.createCellStyle();
      dateCellStyle.setDataFormat(dataFormat.getFormat("yyyy-mm-dd"));
      dateCellStyle.setAlignment(HorizontalAlignment.CENTER);

      int rowNum = 1;
      for (CandidateFeedback feedback : feedbackList) {
        Row dataRow = sheet.createRow(rowNum++);
        Cell cell1 = dataRow.createCell(0);
        cell1.setCellValue(feedback.getId());
        cell1.setCellStyle(dataCellStyle);

        Cell cell2 = dataRow.createCell(1);
        cell2.setCellValue(feedback.getCandidateName());
        cell2.setCellStyle(dataCellStyle);

        Cell cell3 = dataRow.createCell(2);
        cell3.setCellValue(feedback.getDateOfInterview());
        cell3.setCellStyle(dateCellStyle);

        Cell cell4 = dataRow.createCell(3);
        cell4.setCellValue(feedback.getPositionAppliedFor());
        cell4.setCellStyle(dataCellStyle);

        Cell cell5 = dataRow.createCell(4);
        cell5.setCellValue(feedback.getInterviewer());
        cell5.setCellStyle(dataCellStyle);

        Cell cell6 = dataRow.createCell(5);
        cell6.setCellValue(feedback.getEducationalBackgroundRating());
        cell6.setCellStyle(dataCellStyle);

        Cell cell7 = dataRow.createCell(6);
        cell7.setCellValue(feedback.getWorkExperienceRating());
        cell7.setCellStyle(dataCellStyle);

        Cell cell8 = dataRow.createCell(7);
        cell8.setCellValue(feedback.getTechnicalSkillsRating());
        cell8.setCellStyle(dataCellStyle);

        Cell cell9 = dataRow.createCell(8);
        cell9.setCellValue(feedback.getCommunicationSkillsRating());
        cell9.setCellStyle(dataCellStyle);

        Cell cell10 = dataRow.createCell(9);
        cell10.setCellValue(feedback.getCandidateInterestRating());
        cell10.setCellStyle(dataCellStyle);

        Cell cell11 = dataRow.createCell(10);
        cell11.setCellValue(feedback.getInterpersonalSkillsRating());
        cell11.setCellStyle(dataCellStyle);

        Cell cell12 = dataRow.createCell(11);
        cell12.setCellValue(feedback.getOverallRating());
        cell12.setCellStyle(dataCellStyle);

        Cell cell13 = dataRow.createCell(12);
        cell13.setCellValue(feedback.getComments());
        cell13.setCellStyle(dataCellStyle);

        Cell cell14 = dataRow.createCell(13);
        cell14.setCellValue(feedback.getResult());
        cell14.setCellStyle(dataCellStyle);
      }

      for (int i = 0; i < headerRow.getLastCellNum(); i++) {
        sheet.autoSizeColumn(i, true);
      }

      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      workbook.write(outputStream);
      workbook.close();

      return outputStream;
    }

    public static ByteArrayOutputStream exportSampleExcel() throws IOException {
      Workbook workbook = new XSSFWorkbook();
      Sheet sheet = workbook.createSheet("Sample Excel file for Upload");

      CellStyle headerStyle = workbook.createCellStyle();
      Font headerFont = workbook.createFont();
      headerFont.setBold(true);
      headerFont.setFontHeightInPoints((short) 14);
      headerFont.setFontName("Arial");
      headerFont.setColor(IndexedColors.BLACK.getIndex());
      headerStyle.setFillForegroundColor(IndexedColors.TURQUOISE.getIndex());
      headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
      headerStyle.setFont(headerFont);
      headerStyle.setAlignment(HorizontalAlignment.CENTER);

      Row headerRow = sheet.createRow(0);
      headerRow.createCell(0).setCellValue("First Name");
      headerRow.createCell(1).setCellValue("Last Name");
      headerRow.createCell(2).setCellValue("Email");
      headerRow.createCell(3).setCellValue("Mobile Number");
      headerRow.createCell(4).setCellValue("Current Country");
      headerRow.createCell(5).setCellValue("Current State");
      headerRow.createCell(6).setCellValue("Current City");
      headerRow.createCell(7).setCellValue("Permanent Country");
      headerRow.createCell(8).setCellValue("Permanent State");
      headerRow.createCell(9).setCellValue("Permanent City");
      headerRow.createCell(10).setCellValue("Highest Degree");
      headerRow.createCell(11).setCellValue("Specialization");
      headerRow.createCell(12).setCellValue("Year of Achievement");
      headerRow.createCell(13).setCellValue("Source");
      headerRow.createCell(14).setCellValue("Referred by: First Name");
      headerRow.createCell(15).setCellValue("Referred by: Last Name");
      headerRow.createCell(16).setCellValue("Key Skills");
      headerRow.createCell(17).setCellValue("May know Skills");
      headerRow.createCell(18).setCellValue("Total Experience");
      headerRow.createCell(19).setCellValue("Current CTC");
      headerRow.createCell(20).setCellValue("Expected CTC");
      headerRow.createCell(21).setCellValue("Current Notice Period");
      headerRow.createCell(22).setCellValue("Work Mode");
      headerRow.createCell(23).setCellValue("Communication Skills");
      headerRow.createCell(24).setCellValue("Enrolled Date");
      headerRow.createCell(25).setCellValue("Links");
      headerRow.createCell(26).setCellValue("Note by Candidates");
      headerRow.createCell(27).setCellValue("Notes By Interviewer");
      headerRow.createCell(28).setCellValue("Job Id");

      for (Cell cell : headerRow) {
        cell.setCellStyle(headerStyle);
      }

      for (int i = 0; i < headerRow.getLastCellNum(); i++) {
        sheet.autoSizeColumn(i);
      }

      CellStyle dataCellStyle = workbook.createCellStyle();
      dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      workbook.write(outputStream);
      workbook.close();

      return outputStream;
    }
  }
}
