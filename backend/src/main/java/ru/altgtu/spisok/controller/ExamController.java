package ru.altgtu.spisok.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.altgtu.spisok.entity.Exam;
import ru.altgtu.spisok.repository.ExamRepository;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ExamController {

    private final ExamRepository examRepository;

    @GetMapping("/exams")
    public List<String> getAllExams() {
        return examRepository.findAll().stream()
                .map(Exam::getName)
                .toList();
    }
}