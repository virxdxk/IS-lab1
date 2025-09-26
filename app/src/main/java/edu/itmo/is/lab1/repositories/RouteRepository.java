package edu.itmo.is.lab1.repositories;

import edu.itmo.is.lab1.entities.Location;
import edu.itmo.is.lab1.entities.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    long deleteByRating(Double rating);
    long countByRating(Double rating);
    List<Route> findByRatingLessThan(Double rating);
    Page<Route> findByName(String name, Pageable pageable); // фильтр по точному совпадению
    Page<Route> findByFrom_Name(String name, Pageable pageable);
    Page<Route> findByTo_Name(String name, Pageable pageable);

    List<Route> findByFromAndTo(Location from, Location to);
    List<Route> findByFrom(Location from);
    List<Route> findByTo(Location to);
}
