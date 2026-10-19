package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Exam;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Integer> {
}