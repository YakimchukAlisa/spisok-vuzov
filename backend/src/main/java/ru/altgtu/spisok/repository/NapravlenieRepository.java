package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Napravlenie;
import java.util.List;

@Repository
public interface NapravlenieRepository extends JpaRepository<Napravlenie, Integer> {

    // Найти направления по ID вуза (через факультеты)
    @Query("SELECT n FROM Napravlenie n " +
            "JOIN FETCH n.fakultet f " +
            "WHERE f.vuz.id = :vuzId")
    List<Napravlenie> findByVuzId(@Param("vuzId") Integer vuzId);
}