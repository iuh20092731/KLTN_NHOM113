package com.apartmentservices.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.models.ActiveUser;
import com.apartmentservices.repositories.ActiveUserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ActiveUserService {

    ActiveUserRepository activeUserRepository;

    @Transactional
    public ActiveUser createActiveUser(ActiveUser activeUser) {
        try {
            return activeUserRepository.save(activeUser);
        } catch (Exception e) {
            log.error("Error creating ActiveUser", e);
            throw new AppException(ErrorCode.ACTIVE_USER_CREATION_FAILED);
        }
    }

    public ActiveUser getActiveUser(Integer userSessionId) {
        return activeUserRepository.findById(userSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVE_USER_NOT_FOUND));
    }

    public List<ActiveUser> getAllActiveUsers() {
        return activeUserRepository.findAll();
    }

    @Transactional
    public ActiveUser updateActiveUser(Integer userSessionId, ActiveUser updatedActiveUser) {
        return activeUserRepository.findById(userSessionId)
                .map(activeUser -> {
                    activeUser.setSessionStart(updatedActiveUser.getSessionStart());
                    activeUser.setLastActivity(updatedActiveUser.getLastActivity());
                    activeUser.setUser(updatedActiveUser.getUser());
                    return activeUserRepository.save(activeUser);
                })
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVE_USER_NOT_FOUND));
    }

    @Transactional
    public void deleteActiveUser(Integer userSessionId) {
        if (!activeUserRepository.existsById(userSessionId)) {
            throw new AppException(ErrorCode.ACTIVE_USER_NOT_FOUND);
        }
        try {
            activeUserRepository.deleteById(userSessionId);
        } catch (Exception e) {
            log.error("Error deleting ActiveUser", e);
            throw new AppException(ErrorCode.ACTIVE_USER_DELETION_FAILED);
        }
    }
}
