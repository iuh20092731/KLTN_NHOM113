package com.apartmentservices.repositories;

import com.apartmentservices.models.RealEstateListing;
import com.apartmentservices.models.RealEstateMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RealEstateMediaRepository extends JpaRepository<RealEstateMedia, Integer> {

//    List<RealEstateMedia> findByListing(RealEstateListing listing);

    @Query("SELECT r FROM RealEstateMedia r WHERE r.realEstateListing.listingId = :listingId")
    List<RealEstateMedia> findRealEstateMediaByRealEstateListing(@Param("listingId") Integer listingId);

    @Query("SELECT MAX(m.seq) FROM RealEstateMedia m WHERE m.realEstateListing.listingId = :listingId")
    Integer findMaxSeqByListingId(@Param("listingId") Integer listingId);

}
