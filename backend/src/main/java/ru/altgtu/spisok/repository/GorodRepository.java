package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Gorod;

import java.util.List;

@Repository
public interface GorodRepository extends JpaRepository<Gorod, Integer> {
    List<Gorod> findByRegionId(Integer regionId);
}