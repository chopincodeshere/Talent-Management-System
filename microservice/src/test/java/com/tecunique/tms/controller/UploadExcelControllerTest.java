package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.services.UploadExcelService;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@SpringBootTest
public class UploadExcelControllerTest {

  private UploadExcelController uploadExcelController;

  @Mock private UploadExcelService uploadExcelService;

  @Mock private MultipartFile multipartFile;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    uploadExcelController = new UploadExcelController(uploadExcelService);
  }

  @Test
  public void uploadFile_ValidExcel_ReturnsOkResponse() throws IOException {
    List<Candidates> candidatesList = List.of(new Candidates(), new Candidates());

    try (MockedStatic<UploadExcelService> mockedStatic = mockStatic(UploadExcelService.class)) {
      mockedStatic.when(() -> UploadExcelService.checkExcelFormat(any())).thenReturn(true);

      doReturn(candidatesList).when(uploadExcelService).readExcelFile(any());
      doReturn("application/vnd.ms-excel").when(multipartFile).getContentType();

      ResponseEntity<Object> response = uploadExcelController.uploadFile(multipartFile);

      assertEquals(HttpStatus.OK, response.getStatusCode());
      assertNotNull(response.getBody());
      Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
      assertEquals("File uploaded successfully", responseBody.get("message"));
      assertEquals(candidatesList.size(), responseBody.get("candidatesProcessed"));
      verify(uploadExcelService).readExcelFile(any());
    }
  }

  @Test
  public void uploadFile_InvalidExcel_ReturnsBadRequest() throws IOException {
    try (MockedStatic<UploadExcelService> mockedStatic = mockStatic(UploadExcelService.class)) {
      mockedStatic.when(() -> UploadExcelService.checkExcelFormat(any())).thenReturn(false);

      doReturn("application/vnd.ms-excel").when(multipartFile).getContentType();

      ResponseEntity<Object> response = uploadExcelController.uploadFile(multipartFile);

      assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals("Invalid file format. Only Excel files are allowed.", response.getBody());
    }
  }

  @Test
  public void uploadFile_ExceptionThrown_ReturnsInternalServerError() throws IOException {
    List<Candidates> candidatesList = List.of(new Candidates(), new Candidates());

    try (MockedStatic<UploadExcelService> mockedStatic = mockStatic(UploadExcelService.class)) {
      mockedStatic.when(() -> UploadExcelService.checkExcelFormat(any())).thenReturn(true);
      doThrow(new IOException()).when(uploadExcelService).readExcelFile(any());
      doReturn("application/vnd.ms-excel").when(multipartFile).getContentType();

      ResponseEntity<Object> response = uploadExcelController.uploadFile(multipartFile);

      assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
      assertNotNull(response.getBody());
      assertEquals("Error processing the file.", response.getBody());
      verify(uploadExcelService).readExcelFile(any());
    }
  }
}
