package com.apartmentservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.apartmentservices.models.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("SELECT MAX(c.categorySeq) FROM Category c")
    Optional<Integer> findMaxCategorySeq();

    List<Category> findAllByOrderByCategorySeqAsc();

    Optional<Category> findFirstByCategoryNameNoDiacriticsContainingIgnoreCase(String categoryNameNoDiacritics);

}
