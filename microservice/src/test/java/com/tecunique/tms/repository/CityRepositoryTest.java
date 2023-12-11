package com.tecunique.tms.repository;

import static org.junit.jupiter.api.Assertions.*;

import com.tecunique.tms.entity.City;
import com.tecunique.tms.entity.State;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
public class CityRepositoryTest {
  @Autowired private CityRepository cityRepository;

  @Autowired private StateRepository stateRepository;

  @Autowired private TestEntityManager entityManager;

  @Test
  public void testSaveCity() {
    State state = new State();
    state.setName("Gujarat");

    stateRepository.save(state);

    City city = new City();
    city.setName("Vadodara");
    city.setState(state);

    City savedCity = cityRepository.save(city);

    assertNotNull(savedCity.getId());
    assertEquals("Vadodara", savedCity.getName());
  }

  @Test
  public void testFindById() {
    State state = new State();
    state.setName("Gujarat");

    stateRepository.save(state);

    City city = new City();
    city.setName("Vadodara");
    city.setState(state);

    entityManager.persist(city);
    entityManager.flush();

    Optional<City> foundCity = cityRepository.findById(city.getId());

    assertTrue(foundCity.isPresent());
    assertEquals("Vadodara", foundCity.get().getName());
  }

  @Test
  public void testFindByState() {
    State state = new State();
    state.setName("Gujarat");

    stateRepository.save(state);

    City city1 = new City();
    city1.setName("Vadodara");
    city1.setState(state);

    City city2 = new City();
    city2.setName("Ahmedabad");
    city2.setState(state);

    entityManager.persist(city1);
    entityManager.persist(city2);
    entityManager.flush();

    List<City> cities = cityRepository.findCitiesByState(state);

    assertEquals(2, cities.size());
    assertEquals("Vadodara", cities.get(0).getName());
    assertEquals("Ahmedabad", cities.get(1).getName());
  }
}
