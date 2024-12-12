package com.apartmentservices.repositories;

import com.apartmentservices.models.RealEstatePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RealEstatePostRepository extends JpaRepository<RealEstatePost, Integer> {
    @Query(value = "SELECT * FROM real_estate_post ORDER BY created_at DESC LIMIT :n", nativeQuery = true)
    List<RealEstatePost> findTopNByOrderByCreatedAtAsc(@Param("n") Integer n);
}
