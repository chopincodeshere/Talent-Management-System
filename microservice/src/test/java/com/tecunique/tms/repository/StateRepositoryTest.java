package com.tecunique.tms.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.Country;
import com.tecunique.tms.entity.State;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@DataJpaTest
public class StateRepositoryTest {
  @Autowired private StateRepository stateRepository;

  @Autowired private TestEntityManager entityManager;

  @Test
  public void testSaveState() {
    Country country = new Country();
    country.setName("United States");
    country.setNativeName("United States of America");
    country.setPhone("+1");
    country.setContinent("North America");
    country.setCurrency("USD");
    country.setLanguages(List.of("English"));
    country.setEmoji("🇺🇸");
    country.setEmojiU("\uD83C\uDDFA\uD83C\uDDF8");

    entityManager.persist(country);
    entityManager.flush();

    State state = new State();
    state.setName("California");
    state.setCountry(country);

    State savedState = stateRepository.save(state);

    assertNotNull(savedState.getId());
    assertEquals("California", savedState.getName());
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

    State state = new State();
    state.setName("Ontario");
    state.setCountry(country);

    entityManager.persist(state);
    entityManager.flush();

    Optional<State> foundState = stateRepository.findById(state.getId());

    assertTrue(foundState.isPresent());
    assertEquals("Ontario", foundState.get().getName());
  }

  @Test
  public void testFindByCountry() {
    Country country = new Country();
    country.setName("India");
    country.setNativeName("India");
    country.setPhone("+91");
    country.setContinent("Asia");
    country.setCurrency("INR");
    country.setLanguages(
        Arrays.asList("Hindi", "Gujarati", "Marathi", "Telugu", "Kannada", "Punjabi", "Bengali"));
    country.setEmoji("IN");
    country.setEmojiU("\uD83C\uDDE9\uD83C\uDDEA");

    entityManager.persist(country);
    entityManager.flush();

    State state1 = new State();
    state1.setName("Gujarat");
    state1.setCountry(country);

    State state2 = new State();
    state2.setName("Maharashtra");
    state2.setCountry(country);

    entityManager.persist(state1);
    entityManager.persist(state2);
    entityManager.flush();

    List<State> states = stateRepository.findStatesByCountry(country);
    assertEquals(2, states.size());
    assertEquals("Gujarat", states.get(0).getName());
    assertEquals("Maharashtra", states.get(1).getName());
  }
}
