package com.apartmentservices.services;

import java.util.List;

import com.apartmentservices.dto.request.FAQCreationRequest;
import com.apartmentservices.dto.request.FAQUpdateRequest;
import com.apartmentservices.dto.response.FAQResponse;

public interface FAQService {
//    FAQResponse createFAQ(FAQCreationRequest request);
    List<FAQResponse> getFAQs();
    FAQResponse getFAQById(Integer faqId);
//    FAQResponse updateFAQ(Long faqId, FAQUpdateRequest request);
//    void deleteFAQ(Long faqId);
    List<FAQResponse> getFAQsByAdvertisementId(Integer advertisementId);

    FAQResponse createFAQ(FAQCreationRequest request);

    FAQResponse updateFAQ(Integer faqId, FAQUpdateRequest request);

    void deleteFAQ(Integer faqId);


}
