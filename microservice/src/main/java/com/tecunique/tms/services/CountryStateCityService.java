package com.tecunique.tms.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.tecunique.tms.entity.City;
import com.tecunique.tms.entity.Country;
import com.tecunique.tms.entity.State;
import com.tecunique.tms.repository.CityRepository;
import com.tecunique.tms.repository.CountryRepository;
import com.tecunique.tms.repository.StateRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Service;

@Service
@Data
@AllArgsConstructor
public class CountryStateCityService {
  private final CountryRepository countryRepository;
  private final StateRepository stateRepository;
  private final CityRepository cityRepository;

  public void saveCountryDataFromJson(JsonNode jsonNode) {
    Country country = createCountryFromJson(jsonNode);
    countryRepository.save(country);

    JsonNode statesNode = jsonNode.get("states");
    if (statesNode != null && statesNode.isObject()) {
      Iterator<Map.Entry<String, JsonNode>> statesIterator = statesNode.fields();
      while (statesIterator.hasNext()) {
        Map.Entry<String, JsonNode> stateEntry = statesIterator.next();
        State state = createStateFromJson(stateEntry.getKey(), stateEntry.getValue(), country);
        stateRepository.save(state);

        JsonNode citiesNode = stateEntry.getValue();
        if (citiesNode != null && citiesNode.isArray()) {
          for (JsonNode cityNode : citiesNode) {
            City city = createCityFromJson(cityNode, state);
            cityRepository.save(city);
          }
        }
      }
    }
  }

  private Country createCountryFromJson(JsonNode jsonNode) {
    Country country = new Country();
    country.setName(jsonNode.get("name").asText());
    country.setNativeName(jsonNode.get("native").asText());
    country.setPhone(jsonNode.get("phone").asText());
    country.setContinent(jsonNode.get("continent").asText());
    country.setCurrency(jsonNode.get("currency").asText());

    List<String> languages = new ArrayList<>();
    JsonNode languagesNode = jsonNode.get("languages");
    if (languagesNode != null && languagesNode.isArray()) {
      for (JsonNode languageNode : languagesNode) {
        languages.add(languageNode.asText());
      }
    }
    country.setLanguages(languages);

    country.setEmoji(jsonNode.get("emoji").asText());
    country.setEmojiU(jsonNode.get("emojiU").asText());

    return country;
  }

  private State createStateFromJson(String stateName, JsonNode jsonNode, Country country) {
    State state = new State();
    state.setName(stateName);
    state.setCountry(country);
    return state;
  }

  private City createCityFromJson(JsonNode jsonNode, State state) {
    City city = new City();
    city.setName(jsonNode.get("name").asText());
    city.setState(state);
    return city;
  }

  public List<State> getAllStatesForCountry(Long countryId) {
    Country country = countryRepository.findById(countryId).orElse(null);
    if (country == null) {
      // Handle country not found error, e.g., throw an exception or return an empty list
      return Collections.emptyList();
    }

    return stateRepository.findStatesByCountry(country);
  }

  public List<City> getAllCitiesForState(Long stateId) {
    State state = stateRepository.findById(stateId).orElse(null);
    if (state == null) {
      // Handle state not found error, e.g., throw an exception or return an empty list
      return Collections.emptyList();
    }

    return cityRepository.findCitiesByState(state);
  }
}
