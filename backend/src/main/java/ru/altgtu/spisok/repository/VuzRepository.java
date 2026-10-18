package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Vuz;

import java.util.List;

@Repository
public interface VuzRepository extends JpaRepository<Vuz, Integer> {
    List<Vuz> findAllByOrderByNameAsc();
}