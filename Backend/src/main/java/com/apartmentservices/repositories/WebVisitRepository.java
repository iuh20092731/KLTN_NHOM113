package com.apartmentservices.repositories;

import com.apartmentservices.models.WebVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WebVisitRepository extends JpaRepository<WebVisit, Integer> {
    Optional<WebVisit> findByVisitDate(LocalDate visitDate);

    List<WebVisit> findByVisitDateBetween(LocalDate startDate, LocalDate endDate);
}
