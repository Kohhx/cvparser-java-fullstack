package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResumeRepository  extends JpaRepository<Resume, Long> {
       List<Resume> findByUser(User user);

       @Query("SELECT r FROM Resume r")
       Page<List<Resume>> findAllWithPage(PageRequest pageable);
}
