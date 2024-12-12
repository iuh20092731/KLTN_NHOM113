package com.apartmentservices.repositories;

import com.apartmentservices.models.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Integer> {

    // Tìm tất cả các câu hỏi của một quảng cáo cụ thể
//    List<FAQ> findByAdvertisement_Id(Integer advertisementId);
    List<FAQ> findByAdvertisement_AdvertisementId(Integer advertisementId);
}
