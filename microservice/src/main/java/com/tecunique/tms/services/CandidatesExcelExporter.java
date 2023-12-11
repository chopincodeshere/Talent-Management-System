package com.tecunique.tms.services;

import com.tecunique.tms.entity.CandidateFeedback;
import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.entity.Referral;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import lombok.AllArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@AllArgsConstructor
public class CandidatesExcelExporter {

  public static ByteArrayOutputStream exportDataToExcel(List<Candidates> data) throws IOException {
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
    headerRow.createCell(5).setCellValue("Job Requirements");

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

      Cell cell6 = dataRow.createCell(5);
      cell6.setCellValue(jobPosition.getRequirements());
      cell6.setCellStyle(dataCellStyle);
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
    headerRow.createCell(0).setCellValue("First Name*");
    headerRow.createCell(1).setCellValue("Last Name*");
    headerRow.createCell(2).setCellValue("Email*");
    headerRow.createCell(3).setCellValue("Mobile Number*");
    headerRow.createCell(4).setCellValue("Current Country*");
    headerRow.createCell(5).setCellValue("Current State*");
    headerRow.createCell(6).setCellValue("Current City*");
    headerRow.createCell(7).setCellValue("Permanent Country*");
    headerRow.createCell(8).setCellValue("Permanent State*");
    headerRow.createCell(9).setCellValue("Permanent City*");
    headerRow.createCell(10).setCellValue("Highest Degree*");
    headerRow.createCell(11).setCellValue("Specialization*");
    headerRow.createCell(12).setCellValue("Year of Achievement (YYYY-MM-DD)*");
    headerRow.createCell(13).setCellValue("Source*");
    headerRow.createCell(14).setCellValue("Referred by: First Name");
    headerRow.createCell(15).setCellValue("Referred by: Last Name");
    headerRow.createCell(16).setCellValue("Key Skills*");
    headerRow.createCell(17).setCellValue("May know Skills");
    headerRow.createCell(18).setCellValue("Total Experience*");
    headerRow.createCell(19).setCellValue("Current CTC (in lakhs)*");
    headerRow.createCell(20).setCellValue("Expected CTC (in lakhs)*");
    headerRow.createCell(21).setCellValue("Current Notice Period*");
    headerRow.createCell(22).setCellValue("Work Mode*");
    headerRow.createCell(23).setCellValue("Communication Skills (out of 10)*");
    headerRow.createCell(24).setCellValue("Enrolled Date (YYYY-MM-DD)*");
    headerRow.createCell(25).setCellValue("Links");
    headerRow.createCell(26).setCellValue("Note by Candidates");
    headerRow.createCell(27).setCellValue("Notes By Interviewer");
    headerRow.createCell(28).setCellValue("Job Id*");

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
