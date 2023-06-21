package com.avensys.CVparserApplication.company;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    void deleteByResumeId(long resumeId);
}
