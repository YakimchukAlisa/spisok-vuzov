package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.VuzVozm;

import java.util.List;

@Repository
public interface VuzVozmRepository extends JpaRepository<VuzVozm, Integer> {

    // Находим все возможности для конкретного вуза
    @Query("SELECT vv FROM VuzVozm vv JOIN FETCH vv.dopVozm WHERE vv.vuz.id = :vuzId")
    List<VuzVozm> findByVuzId(@Param("vuzId") Integer vuzId);
}