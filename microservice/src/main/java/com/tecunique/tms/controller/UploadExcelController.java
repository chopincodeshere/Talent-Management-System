package com.tecunique.tms.controller;

import com.tecunique.tms.entity.Candidates;
import com.tecunique.tms.services.UploadExcelService;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/candidates")
public class UploadExcelController {

  private final UploadExcelService uploadExcelService;

  public UploadExcelController(UploadExcelService uploadExcelService) {
    this.uploadExcelService = uploadExcelService;
  }

  @PostMapping("/uploadExcel")
  @PreAuthorize("hasRole('client_admin')")
  public ResponseEntity<Object> uploadFile(@RequestParam("file") MultipartFile file) {
    if (!UploadExcelService.checkExcelFormat(file)) {
      return ResponseEntity.badRequest().body("Invalid file format. Only Excel files are allowed.");
    }

    try {
      List<Candidates> candidatesList = uploadExcelService.readExcelFile(file);
      // Process the candidatesList as needed

      Map<String, Object> response = new HashMap<>();
      response.put("message", "File uploaded successfully");
      response.put("candidatesProcessed", candidatesList.size());

      return ResponseEntity.ok(response);
    } catch (IOException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Error processing the file.");
    }
  }
}
