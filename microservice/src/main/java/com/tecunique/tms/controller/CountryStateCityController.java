package com.tecunique.tms.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecunique.tms.entity.City;
import com.tecunique.tms.entity.State;
import com.tecunique.tms.services.CountryStateCityService;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/country")
@AllArgsConstructor
public class CountryStateCityController {
  private final CountryStateCityService countryStateCityService;
  private final ObjectMapper objectMapper;

  @PostMapping("/add")
  public ResponseEntity<String> addCountryData() {
    try {
      File file =
          new File(
              "D:\\TMS Updated\\talent-management\\microservice\\src\\main\\java\\com\\tecunique\\tms\\data\\Country.json");
      FileInputStream fileInputStream = new FileInputStream(file);
      JsonNode jsonNode = objectMapper.readTree(fileInputStream);
      countryStateCityService.saveCountryDataFromJson(jsonNode);
      return ResponseEntity.ok("Data added successfully");
    } catch (IOException e) {
      e.printStackTrace();
      return ResponseEntity.badRequest().body("Error reading JSON data");
    }
  }

  @GetMapping("/{countryId}/states")
  public ResponseEntity<List<State>> getAllStatesForCountry(@PathVariable Long countryId) {
    List<State> states = countryStateCityService.getAllStatesForCountry(countryId);
    if (states.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(states);
  }

  @GetMapping("/{stateId}/cities")
  public ResponseEntity<List<City>> getAllCitiesForState(@PathVariable Long stateId) {
    List<City> cities = countryStateCityService.getAllCitiesForState(stateId);
    if (cities.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(cities);
  }
}
