package com.tecunique.tms.repository;

import com.tecunique.tms.entity.City;
import com.tecunique.tms.entity.State;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CityRepository extends JpaRepository<City, Long> {
  @Query("SELECT c FROM City c WHERE c.state = :state")
  List<City> findCitiesByState(State state);
}
