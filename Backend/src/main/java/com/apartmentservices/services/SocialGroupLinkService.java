package com.apartmentservices.services;

import com.apartmentservices.dto.request.info.SocialGroupLinkCreationRequest;
import com.apartmentservices.dto.request.info.SocialGroupLinkUpdateRequest;
import com.apartmentservices.dto.response.info.SocialGroupLinkResponse;

import java.util.List;

public interface SocialGroupLinkService {
    SocialGroupLinkResponse createLink(SocialGroupLinkCreationRequest request);
    SocialGroupLinkResponse getLinkById(Integer linkId);
    SocialGroupLinkResponse updateLink(Integer linkId, SocialGroupLinkUpdateRequest request);
    void deleteLink(Integer linkId);

    List<SocialGroupLinkResponse> getAllLinks();
}
