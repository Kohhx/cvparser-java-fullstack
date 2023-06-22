package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository  extends JpaRepository<Resume, Long> {
       List<Resume> findByUser(User user);
}
