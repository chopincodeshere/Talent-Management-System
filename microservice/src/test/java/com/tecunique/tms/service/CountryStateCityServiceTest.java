package com.tecunique.tms.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tecunique.tms.entity.City;
import com.tecunique.tms.entity.Country;
import com.tecunique.tms.entity.State;
import com.tecunique.tms.repository.CityRepository;
import com.tecunique.tms.repository.CountryRepository;
import com.tecunique.tms.repository.StateRepository;
import com.tecunique.tms.services.CountryStateCityService;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class CountryStateCityServiceTest {
  @Mock private CountryRepository countryRepository;

  @Mock private StateRepository stateRepository;

  @Mock private CityRepository cityRepository;

  private CountryStateCityService countryStateCityService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    countryStateCityService =
        new CountryStateCityService(countryRepository, stateRepository, cityRepository);
  }

  @Test
  void saveCountryDataFromJson_ValidJson_SavesCountryAndRelatedData() {
    // Arrange
    JsonNode validJsonNode = createValidJsonNode();
    Country country = createCountryFromJsonNode(validJsonNode);
    Map.Entry<String, JsonNode> stateEntry = validJsonNode.get("states").fields().next();
    State state = createStateFromJsonNode(stateEntry);
    City city = createCityFromJsonNode(stateEntry.getValue().get(0));

    when(countryRepository.save(any(Country.class))).thenReturn(country);
    when(stateRepository.save(any(State.class))).thenReturn(state);
    when(cityRepository.save(any(City.class))).thenReturn(city);

    // Act
    countryStateCityService.saveCountryDataFromJson(validJsonNode);

    // Assert
    verify(countryRepository).save(any(Country.class));
    verify(stateRepository, times(1)).save(any(State.class));
    verify(cityRepository, times(2)).save(any(City.class));
  }

  private JsonNode createValidJsonNode() {
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNodeFactory nodeFactory = objectMapper.getNodeFactory();

    ObjectNode jsonNode = nodeFactory.objectNode();
    jsonNode.put("name", "Country Name");
    jsonNode.put("native", "Native Name");
    jsonNode.put("phone", "1234567890");
    jsonNode.put("continent", "Continent");
    jsonNode.put("currency", "Currency");

    ArrayNode languagesNode = nodeFactory.arrayNode();
    languagesNode.add("Language 1");
    languagesNode.add("Language 2");
    jsonNode.set("languages", languagesNode);

    jsonNode.put("emoji", "Emoji");
    jsonNode.put("emojiU", "EmojiU");

    ObjectNode statesNode = nodeFactory.objectNode();
    ArrayNode citiesNode = nodeFactory.arrayNode();
    ObjectNode city1Node = nodeFactory.objectNode();
    city1Node.put("name", "City 1");
    ObjectNode city2Node = nodeFactory.objectNode();
    city2Node.put("name", "City 2");
    citiesNode.add(city1Node);
    citiesNode.add(city2Node);
    statesNode.set("State Name", citiesNode);

    jsonNode.set("states", statesNode);

    return jsonNode;
  }

  private Country createCountryFromJsonNode(JsonNode jsonNode) {
    Country country = new Country();
    country.setName(jsonNode.get("name").asText());
    country.setNativeName(jsonNode.get("native").asText());
    country.setPhone(jsonNode.get("phone").asText());
    country.setContinent(jsonNode.get("continent").asText());
    country.setCurrency(jsonNode.get("currency").asText());
    // Set other properties of the Country object as needed

    return country;
  }

  private State createStateFromJsonNode(Map.Entry<String, JsonNode> jsonNodeEntry) {
    String stateName = jsonNodeEntry.getKey();
    JsonNode stateJsonNode = jsonNodeEntry.getValue();

    State state = new State();
    state.setName(stateName);

    return state;
  }

  private City createCityFromJsonNode(JsonNode jsonNode) {
    String cityName = jsonNode.get("name").asText();

    City city = new City();
    city.setName(cityName);

    return city;
  }
}
