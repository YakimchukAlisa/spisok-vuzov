package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Profile;

import java.util.List;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    // Найти все профили по ID направления
    @Query("SELECT p FROM Profile p " +
            "JOIN FETCH p.formObuch " +
            "JOIN FETCH p.urObraz " +
            "WHERE p.napravlenie.id = :napravlenieId")
    List<Profile> findByNapravlenieId(@Param("napravlenieId") Integer napravlenieId);
}