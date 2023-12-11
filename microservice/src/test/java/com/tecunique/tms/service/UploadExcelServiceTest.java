package com.tecunique.tms.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.entity.JobPosition;
import com.tecunique.tms.repository.CandidateRepository;
import com.tecunique.tms.repository.JobPositionRepository;
import com.tecunique.tms.services.UploadExcelService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
public class UploadExcelServiceTest {
  private UploadExcelService uploadExcelService;

  @Mock private CandidateRepository candidateRepository;

  @Mock private JobPositionRepository jobPositionRepository;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
    uploadExcelService = new UploadExcelService(candidateRepository, jobPositionRepository);
  }

  @Test
  void checkExcelFormat_ValidExcel_ReturnsTrue() {
    // Arrange
    MultipartFile excelFile =
        new MockMultipartFile(
            "file",
            "test.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            new byte[] {});

    // Act
    boolean result = UploadExcelService.checkExcelFormat(excelFile);

    // Assert
    assertThat(result).isTrue();
  }

  @Test
  void readExcelFile_ValidFile_ReturnsListOfCandidates() throws IOException {
    // Arrange
    MultipartFile excelFile = createMockExcelFile();

    // Mock the jobPositionRepository
    JobPosition jobPosition = new JobPosition();
    jobPosition.setId(1L);
    jobPosition.setJobTitle("Software Engineer");
    when(jobPositionRepository.findJobPositionById(anyLong())).thenReturn(jobPosition);

    // Act
    List<Candidates> candidatesList = uploadExcelService.readExcelFile(excelFile);

    // Assert
    assertThat(candidatesList).isNotNull();
    assertThat(candidatesList).hasSize(2);

    Candidates candidate1 = candidatesList.get(0);
    assertThat(candidate1.getFirstName()).isEqualTo("John");
    assertThat(candidate1.getLastName()).isEqualTo("Doe");

    Candidates candidate2 = candidatesList.get(1);
    assertThat(candidate2.getFirstName()).isEqualTo("Jane");
    assertThat(candidate2.getLastName()).isEqualTo("Smith");

    // Verify that the candidateRepository.saveAll() method was called
    verify(candidateRepository, times(1)).saveAll(candidatesList);
  }

  private MultipartFile createMockExcelFile() throws IOException {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Test Sheet");

    Row headerRow = sheet.createRow(0);
    headerRow.createCell(0).setCellValue("First Name");
    headerRow.createCell(1).setCellValue("Last Name");

    Row dataRow1 = sheet.createRow(1);
    dataRow1.createCell(0).setCellValue("John");
    dataRow1.createCell(1).setCellValue("Doe");

    Row dataRow2 = sheet.createRow(2);
    dataRow2.createCell(0).setCellValue("Jane");
    dataRow2.createCell(1).setCellValue("Smith");

    // Convert the workbook to a byte array
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    workbook.write(outputStream);
    byte[] fileContent = outputStream.toByteArray();

    // Create a MultipartFile with the byte array content
    return new MockMultipartFile(
        "file",
        "test.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        fileContent);
  }
}
