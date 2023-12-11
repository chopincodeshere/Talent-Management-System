package com.tecunique.tms.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecunique.tms.services.CountryStateCityService;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@SpringBootTest
public class CountryStateCityControllerTest {

  private CountryStateCityController countryStateCityController;

  @Mock private CountryStateCityService countryStateCityService;

  @Mock private ObjectMapper objectMapper;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    countryStateCityController =
        new CountryStateCityController(countryStateCityService, objectMapper);
  }

  @Test
  public void addCountryData_Success() throws IOException {
    File file =
        new File(
            "D:\\TMS Updated\\talent-management\\microservice\\src\\main\\java\\com\\tecunique\\tms\\data\\Country.json");
    FileInputStream fileInputStream = new FileInputStream(file);
    JsonNode jsonNode = Mockito.mock(JsonNode.class);
    Mockito.when(objectMapper.readTree(Mockito.any(FileInputStream.class))).thenReturn(jsonNode);

    ResponseEntity<String> response = countryStateCityController.addCountryData();

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Data added successfully", response.getBody());
    verify(countryStateCityService).saveCountryDataFromJson(jsonNode);
  }

  @Test
  public void addCountryData_IOException() throws IOException {
    // Arrange
    InputStream inputStream = getClass().getResourceAsStream("/Country.json");
    doThrow(new IOException()).when(objectMapper).readTree(Mockito.any(InputStream.class));

    // Act
    ResponseEntity<String> response = countryStateCityController.addCountryData();

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Error reading JSON data", response.getBody());
  }
}
