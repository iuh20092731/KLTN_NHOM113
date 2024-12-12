package com.apartmentservices.repositories;

import com.apartmentservices.constant.RealEstateType;
import com.apartmentservices.models.RealEstateListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RealEstateListingRepository extends JpaRepository<RealEstateListing, Integer> {

    Page<RealEstateListing> findByRealEstateType(RealEstateType realEstateType, Pageable pageable);
}
