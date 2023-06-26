package com.avensys.CVparserApplication.resume;

import com.avensys.CVparserApplication.company.Company;
import com.avensys.CVparserApplication.skill.Skill;
import com.avensys.CVparserApplication.user.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name= "Resume")
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false)
    private long id;

    @Column(name = "filename", nullable = false)
    private String fileName;

    private String name;

    private String email;

    private String mobile;

    private int yearsOfExperience;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Company> companies = new ArrayList<>();

    public Resume() {
    }

    public Resume(long id, String fileName, String name, String email, String mobile, int yearsOfExperience, LocalDateTime createdAt, LocalDateTime updatedAt, User user, List<Skill> skills, List<Company> companies) {
        this.id = id;
        this.fileName = fileName;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.yearsOfExperience = yearsOfExperience;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.skills = skills;
        this.companies = companies;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void addSkill(Skill skill) {
        if (this.skills == null) {
            this.skills = new ArrayList<>();
        }
        skill.setResume(this);
        this.skills.add(skill);
    }

    public void addSkills(List<Skill> skills) {
        if (this.skills == null) {
            this.skills = new ArrayList<>();
        }
        skills.stream().forEach(skill -> {
            skill.setResume(this);
            this.skills.add(skill);
        });
    }

    public void addCompany(Company company) {
        if (this.companies == null) {
            this.companies = new ArrayList<>();
        }
        company.setResume(this);
        this.companies.add(company);
    }

    public void addCompanies(List<Company> companies) {
        if (this.companies == null) {
            this.companies = new ArrayList<>();
        }
        companies.stream().forEach(company -> {
            company.setResume(this);
            this.companies.add(company);
        });
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public List<Company> getCompanies() {
        return companies;
    }

    public void setCompanies(List<Company> companies) {
        this.companies = companies;
    }

    @Override
    public String toString() {
        return "Resume{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", mobile='" + mobile + '\'' +
                ", yearsOfExperience=" + yearsOfExperience +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", user=" + user +
                ", skills=" + skills +
                ", companies=" + companies +
                '}';
    }
}
