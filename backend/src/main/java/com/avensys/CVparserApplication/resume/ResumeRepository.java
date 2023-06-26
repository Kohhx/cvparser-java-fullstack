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
       Page<Resume> findAllWithPage(PageRequest pageable);

//       @Query("SELECT r\n" +
//               "FROM Resume r\n" +
//           "JOIN r.user u\n" +
//               "JOIN r.companies c\n" +
//               "JOIN r.skills s\n" +
//               "WHERE\n" +
//               "r.name ILIKE %?1% OR s.name ILIKE %?1% OR u.firstName ILIKE %?1% OR u.lastName ILIKE %?1%")

//       @Query("SELECT r FROM Resume r JOIN r.companies c JOIN r.skills s WHERE r.name ILIKE %?1% OR s.name ILIKE %?1%")
//       Page<Resume> findAllWithSearchPage(String keywords, PageRequest pageable);

       @Query("SELECT r FROM Resume r JOIN r.skills s WHERE s.name ILIKE %?1% OR r.name ILIKE %?1%")
       Page<Resume> findAllWithSearchPage(String keywords, PageRequest pageable);
}
