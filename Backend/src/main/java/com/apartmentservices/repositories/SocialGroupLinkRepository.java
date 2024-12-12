package com.apartmentservices.repositories;

import com.apartmentservices.models.info.SocialGroupLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialGroupLinkRepository extends JpaRepository<SocialGroupLink, Integer> {
    @Query("SELECT MAX(s.serial) FROM SocialGroupLink s")
    Integer findMaxSerial();
}
