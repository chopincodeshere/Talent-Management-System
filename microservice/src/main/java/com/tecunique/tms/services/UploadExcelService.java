package com.tecunique.tms.services;

import com.tecunique.tms.entity.*;
import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.repository.CandidateRepository;
import com.tecunique.tms.repository.JobPositionRepository;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadExcelService {

  private final CandidateRepository candidateRepository;
  private final JobPositionRepository jobPositionRepository;

  public UploadExcelService(
      CandidateRepository candidateRepository, JobPositionRepository jobPositionRepository) {
    this.candidateRepository = candidateRepository;
    this.jobPositionRepository = jobPositionRepository;
  }

  public static boolean checkExcelFormat(MultipartFile file) {
    String contentType = file.getContentType();

    assert contentType != null;
    return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  }

  @Transactional
  public List<Candidates> readExcelFile(MultipartFile file) throws IOException {
    List<Candidates> candidatesList = new ArrayList<>();

    try (InputStream inputStream = file.getInputStream()) {
      Workbook workbook = new XSSFWorkbook(inputStream);
      Sheet sheet = workbook.getSheetAt(0);

      Iterator<Row> rowIterator = sheet.iterator();
      rowIterator.next(); // Skip header row

      while (rowIterator.hasNext()) {
        Row row = rowIterator.next();

        Cell firstNameCell = row.getCell(0);
        Cell lastNameCell = row.getCell(1);
        Cell emailCell = row.getCell(2);
        Cell mobilePhoneCell = row.getCell(3);
        Cell currentCountry = row.getCell(4);
        Cell currentState = row.getCell(5);
        Cell currentCity = row.getCell(6);
        Cell permanentCountry = row.getCell(7);
        Cell permanentState = row.getCell(8);
        Cell permanentCity = row.getCell(9);
        Cell highestDegree = row.getCell(10);
        Cell specialization = row.getCell(11);
        Cell yearOfAchievement = row.getCell(12);
        Cell sourceCell = row.getCell(13);
        Cell referredByFirstName = row.getCell(14);
        Cell referredByLastName = row.getCell(15);
        Cell keySkillsCell = row.getCell(16);
        Cell mayKnowSkillsCell = row.getCell(17);
        Cell totalExperienceCell = row.getCell(18);
        Cell currentCTC = row.getCell(19);
        Cell expectedCTC = row.getCell(20);
        Cell currentNoticePeriodCell = row.getCell(21);
        Cell workModeCell = row.getCell(22);
        Cell communicationSkillsCell = row.getCell(23);
        Cell enrolledDate = row.getCell(24);
        Cell links = row.getCell(25);
        Cell notesByCandidates = row.getCell(26);
        Cell notesByInterviewer = row.getCell(27);
        Cell jobId = row.getCell(28);

        Candidates candidate = new Candidates();

        Address address = new Address();
        address.setCurrentAddress(new CurrentAddress());
        address.setPermanentAddress(new PermanentAddress());
        candidate.setAddress(address);

        Education education = new Education();
        candidate.setEducation(education);

        Referral referral = new Referral();
        candidate.setReferral(referral);

        candidate.setFirstName(getStringCellValue(firstNameCell));
        candidate.setLastName(getStringCellValue(lastNameCell));
        candidate.setEmail(getStringCellValue(emailCell));
        candidate.setMobilePhone(getStringCellValue(mobilePhoneCell));
        candidate
            .getAddress()
            .getCurrentAddress()
            .setCurrentCountry(getStringCellValue(currentCountry));
        candidate
            .getAddress()
            .getCurrentAddress()
            .setCurrentState(getStringCellValue(currentState));
        candidate.getAddress().getCurrentAddress().setCurrentCity(getStringCellValue(currentCity));
        candidate
            .getAddress()
            .getPermanentAddress()
            .setPermanentCountry(getStringCellValue(permanentCountry));
        candidate
            .getAddress()
            .getPermanentAddress()
            .setPermanentState(getStringCellValue(permanentState));
        candidate
            .getAddress()
            .getPermanentAddress()
            .setPermanentCity(getStringCellValue(permanentCity));
        candidate.getEducation().setHighestDegree(getStringCellValue(highestDegree));
        candidate.getEducation().setSpecialization(getStringCellValue(specialization));
        candidate.getEducation().setYearOfAchievement(getLocalDateCellValue(yearOfAchievement));
        candidate.setSource(getStringCellValue(sourceCell));
        candidate.getReferral().setReferred_fname(getStringCellValue(referredByFirstName));
        candidate.getReferral().setReferred_lname(getStringCellValue(referredByLastName));
        candidate.setKeySkills(getStringArrayCellValue(keySkillsCell));
        candidate.setMayKnowSkills(getStringArrayCellValue(mayKnowSkillsCell));
        candidate.setTotalExperience(getIntegerCellValue(totalExperienceCell));
        candidate.setCurrentCTC(getFloatCellValue(currentCTC));
        candidate.setExpectedCTC(getFloatCellValue(expectedCTC));
        candidate.setCurrentNoticePeriod(getStringCellValue(currentNoticePeriodCell));
        candidate.setWorkMode(getStringCellValue(workModeCell));
        candidate.setCommunicationSkills(getIntegerCellValue(communicationSkillsCell));

        candidate.setEnrolledDate(getDateCellValue(enrolledDate));
        candidate.setLinks(getStringArrayCellValue(links));
        candidate.setNote(getStringCellValue(notesByCandidates));
        candidate.setNotesByInterviewer(getStringCellValue(notesByInterviewer));
        candidate.setJob_id(getLongCellValue(jobId));

        Long jobId1 = getLongCellValue(jobId);
        JobPosition jobPosition = jobPositionRepository.findJobPositionById(jobId1);

        candidate.setJobPosition(jobPosition);

        String candidateCode = UUID.randomUUID().toString();
        candidate.setCandidateCode(candidateCode);

        candidatesList.add(candidate);
      }

      workbook.close();
    }

    candidateRepository.saveAll(candidatesList);
    return candidatesList;
  }

  private String getStringCellValue(Cell cell) {
    if (cell != null) {
      if (cell.getCellType() == CellType.STRING) {
        return cell.getStringCellValue();
      } else if (cell.getCellType() == CellType.NUMERIC) {
        double numericValue = cell.getNumericCellValue();
        return String.valueOf(numericValue);
      }
    }
    return null;
  }

  private String[] getStringArrayCellValue(Cell cell) {
    if (cell != null && cell.getCellType() == CellType.STRING) {
      String value = cell.getStringCellValue();
      return value.split(",");
    }
    return null;
  }

  private Integer getIntegerCellValue(Cell cell) {
    if (cell != null && cell.getCellType() == CellType.NUMERIC) {
      return (int) cell.getNumericCellValue();
    }
    return null;
  }

  private Float getFloatCellValue(Cell cell) {
    if (cell != null && cell.getCellType() == CellType.NUMERIC) {
      return (float) cell.getNumericCellValue();
    }
    return null;
  }

  private Long getLongCellValue(Cell cell) {
    if (cell != null && cell.getCellType() == CellType.NUMERIC) {
      return (long) cell.getNumericCellValue();
    }
    return null;
  }

  private LocalDate getLocalDateCellValue(Cell cell) {
    if (cell != null) {
      if (cell.getCellType() == CellType.NUMERIC) {
        return cell.getLocalDateTimeCellValue().toLocalDate();
      } else if (cell.getCellType() == CellType.STRING) {
        String dateString = cell.getStringCellValue();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(dateString, formatter);
      }
    }
    return null;
  }

  private Date getDateCellValue(Cell cell) {
    if (cell != null && cell.getCellType() == CellType.NUMERIC) {
      return cell.getDateCellValue();
    }
    return null;
  }
}
