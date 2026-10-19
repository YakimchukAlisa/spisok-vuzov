package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.dto.VuzCardDto;
import ru.altgtu.spisok.entity.Vuz;

import java.util.List;

@Repository
public interface VuzRepository extends JpaRepository<Vuz, Integer> {

    @Query(value = """
        SELECT 
            v."ID_Vuz" AS id, 
            v."Abbreviatura" AS name, 
            v."Name" AS fullName,
            
            -- МЕСТА: Считаем все места без ограничений по уровню образования
            CAST(COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS integer) AS budgetPlaces,
            
            -- БАЛЛЫ: Ищем минимум ТОЛЬКО среди бакалавриата и игнорируем нули
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND u."Name" = 'Бакалавриат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
            
            -- МЕСТА (Платно)
            CAST(COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS integer) AS paidPlaces,
            
            -- БАЛЛЫ (Платно): Ищем минимум ТОЛЬКО среди бакалавриата и игнорируем нули
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND u."Name" = 'Бакалавриат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
            
            -- ЦЕНА: Ищем минимальную стоимость (тоже только для бакалавриата)
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND u."Name" = 'Бакалавриат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice

        FROM "Vuz" v
        LEFT JOIN "Fakultet" f ON f."ID_Vuz" = v."ID_Vuz"
        LEFT JOIN "Napravlenie" n ON n."ID_Fakultet" = f."ID_Fakultet"
        LEFT JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        LEFT JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur" 
        LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
        GROUP BY v."ID_Vuz", v."Abbreviatura", v."Name"
        """, nativeQuery = true)
    List<VuzCardDto> findAllVuzCards();
}