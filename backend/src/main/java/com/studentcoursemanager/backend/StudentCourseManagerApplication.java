package com.studentcoursemanager.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.studentcoursemanager.backend.entity.User;
import com.studentcoursemanager.backend.repository.UserRepository;

@SpringBootApplication
public class StudentCourseManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentCourseManagerApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository) {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (userRepository.findByEmail("admin@scm.edu").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@scm.edu");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole("admin");
                admin.setRegistrationApproved(true);
                userRepository.save(admin);
            }

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole("admin");
                admin.setRegistrationApproved(true);
                userRepository.save(admin);
            }
        };
    }
}
