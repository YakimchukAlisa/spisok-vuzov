package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.TrebExam;

import java.util.List;

@Repository
public interface TrebExamRepository extends JpaRepository<TrebExam, Integer> {

    @Query("SELECT te FROM TrebExam te JOIN FETCH te.exam WHERE te.ispitania.id = :ispitaniaId")
    List<TrebExam> findByIspitaniaId(@Param("ispitaniaId") Integer ispitaniaId);
}