package com.tecunique.tms.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.Country;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
public class CountryRepositoryTest {
  @Autowired private CountryRepository countryRepository;

  @Autowired private TestEntityManager entityManager;

  @Test
  public void testSaveCountry() {
    Country country = new Country();
    country.setName("United States");
    country.setNativeName("United States of America");
    country.setPhone("+1");
    country.setContinent("North America");
    country.setCurrency("USD");
    country.setLanguages(List.of("English"));
    country.setEmoji("🇺🇸");
    country.setEmojiU("\uD83C\uDDFA\uD83C\uDDF8");

    Country savedCountry = countryRepository.save(country);

    assertNotNull(savedCountry.getId());
    assertEquals("United States", savedCountry.getName());
  }

  @Test
  public void testFindById() {
    Country country = new Country();
    country.setName("Canada");
    country.setNativeName("Canada");
    country.setPhone("+1");
    country.setContinent("North America");
    country.setCurrency("CAD");
    country.setLanguages(Arrays.asList("English", "French"));
    country.setEmoji("🇨🇦");
    country.setEmojiU("\uD83C\uDDE8\uD83C\uDDE6");

    entityManager.persist(country);
    entityManager.flush();

    Optional<Country> foundCountry = countryRepository.findById(country.getId());

    assertTrue(foundCountry.isPresent());
    assertEquals("Canada", foundCountry.get().getName());
  }
}
