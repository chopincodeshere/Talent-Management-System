package com.tecunique.tms.repository;

import com.tecunique.tms.entity.Country;
import com.tecunique.tms.entity.State;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StateRepository extends JpaRepository<State, Long> {
  @Query("SELECT s FROM State s WHERE s.country = :country")
  List<State> findStatesByCountry(Country country);
}
