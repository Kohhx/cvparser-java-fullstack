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

    private double yearsOfExperience;

    private String education;

    private String resumeStorageRef;

    @Column(columnDefinition = "TEXT")
    private String companiesDetails;

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

    // Updated information added 12072023
    private String firstName;
    private String lastName;
    private String gender;
    private String spokenLanguages;
    private String currentLocation;
    private String nationality;
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String profile;

    @Column(columnDefinition = "TEXT")
    private String primarySkills;

    @Column(columnDefinition = "TEXT")
    private String secondarySkills;

    public Resume() {
    }

    public Resume(long id, String fileName, String name, String email, String mobile, double yearsOfExperience, String education, String resumeStorageRef, String companiesDetails, LocalDateTime createdAt, LocalDateTime updatedAt, User user, List<Skill> skills, List<Company> companies, String firstName, String lastName, String gender, String spokenLanguages, String currentLocation, String nationality, String jobTitle, String profile, String primarySkills, String secondarySkills) {
        this.id = id;
        this.fileName = fileName;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.yearsOfExperience = yearsOfExperience;
        this.education = education;
        this.resumeStorageRef = resumeStorageRef;
        this.companiesDetails = companiesDetails;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.skills = skills;
        this.companies = companies;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.spokenLanguages = spokenLanguages;
        this.currentLocation = currentLocation;
        this.nationality = nationality;
        this.jobTitle = jobTitle;
        this.profile = profile;
        this.primarySkills = primarySkills;
        this.secondarySkills = secondarySkills;
    }

    public String getResumeStorageRef() {
        return resumeStorageRef;
    }

    public void setResumeStorageRef(String resumeStorageRef) {
        this.resumeStorageRef = resumeStorageRef;
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

    public double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(double yearsOfExperience) {
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

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getCompaniesDetails() {
        return companiesDetails;
    }

    public void setCompaniesDetails(String companiesDetails) {
        this.companiesDetails = companiesDetails;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSpokenLanguages() {
        return spokenLanguages;
    }

    public void setSpokenLanguages(String spokenLanguages) {
        this.spokenLanguages = spokenLanguages;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getPrimarySkills() {
        return primarySkills;
    }

    public void setPrimarySkills(String primarySkills) {
        this.primarySkills = primarySkills;
    }

    public String getSecondarySkills() {
        return secondarySkills;
    }

    public void setSecondarySkills(String secondarySkills) {
        this.secondarySkills = secondarySkills;
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
