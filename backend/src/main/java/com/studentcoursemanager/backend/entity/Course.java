package com.studentcoursemanager.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "course")
@Data
public class Course {
    @Id
    private String code;
    private String name;
    private String day;
    private String time;
    private Integer credits;
    private Integer capacity;
    private Integer enrolled = 0;
    private String prerequisites;
}
