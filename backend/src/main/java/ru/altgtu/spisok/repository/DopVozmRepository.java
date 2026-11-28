package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.altgtu.spisok.entity.DopVozm;

public interface DopVozmRepository extends JpaRepository<DopVozm, Integer> {
}
