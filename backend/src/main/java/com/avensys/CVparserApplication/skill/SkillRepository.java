package com.avensys.CVparserApplication.skill;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    void deleteByResumeId(long resumeId);
}
