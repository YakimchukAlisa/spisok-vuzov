package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Ispitania;

import java.util.List;

@Repository
public interface IspitaniaRepository extends JpaRepository<Ispitania, Integer> {

    // Находим все "наборы испытаний" для конкретного Post_info
    @Query("SELECT i FROM Ispitania i WHERE i.postInfo.id = :postInfoId")
    List<Ispitania> findByPostInfoId(@Param("postInfoId") Integer postInfoId);
}