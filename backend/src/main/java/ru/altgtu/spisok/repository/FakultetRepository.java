package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.altgtu.spisok.dto.FakultetCardDto;
import ru.altgtu.spisok.entity.Fakultet;
import java.util.List;

public interface FakultetRepository extends JpaRepository<Fakultet, Integer> {

    // 1. Возвращает просто список факультетов для вуза
    List<Fakultet> findByVuzId(Integer vuzId);

    // 2. Сложный запрос для карточек с полной статистикой
    @Query(value = """
        SELECT 
            f."ID_Fakultet" AS id,
            f."Name" AS shortName,
            f."Description" AS fullName,
            f."Logo_Url" AS imageUrl,
            
            -- Статистика БАКАЛАВРИАТА
            COUNT(DISTINCT CASE WHEN u."Name" = 'Бакалавриат' THEN n."ID_Napravlenie" END) AS bachelorDirections,
            COALESCE(SUM(CASE WHEN u."Name" = 'Бакалавриат' AND o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS bachelorBudgetPlaces,
            COALESCE(SUM(CASE WHEN u."Name" = 'Бакалавриат' AND o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS bachelorPaidPlaces,
            CAST(COALESCE(MIN(CASE WHEN u."Name" = 'Бакалавриат' AND o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS bachelorMinPrice,

            -- Статистика МАГИСТРАТУРЫ
            COUNT(DISTINCT CASE WHEN u."Name" = 'Магистратура' THEN n."ID_Napravlenie" END) AS masterDirections,
            COALESCE(SUM(CASE WHEN u."Name" = 'Магистратура' AND o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS masterBudgetPlaces,
            COALESCE(SUM(CASE WHEN u."Name" = 'Магистратура' AND o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS masterPaidPlaces,
            CAST(COALESCE(MIN(CASE WHEN u."Name" = 'Магистратура' AND o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS masterMinPrice

        FROM "Fakultet" f
        LEFT JOIN "Napravlenie" n ON n."ID_Fakultet" = f."ID_Fakultet"
        LEFT JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        LEFT JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur"
        LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
        WHERE f."ID_Vuz" = :vuzId
        GROUP BY f."ID_Fakultet", f."Name", f."Description", f."Logo_Url"
        """, nativeQuery = true)
    List<FakultetStatsProjection> findFakultetStatsByVuzId(@Param("vuzId") Integer vuzId);

    // Интерфейс-проекция для маппинга результата запроса
    interface FakultetStatsProjection {
        Integer getId();
        String getShortName();
        String getFullName();
        String getImageUrl();

        Integer getBachelorDirections();
        Integer getBachelorBudgetPlaces();
        Integer getBachelorPaidPlaces();
        Integer getBachelorMinPrice();

        Integer getMasterDirections();
        Integer getMasterBudgetPlaces();
        Integer getMasterPaidPlaces();
        Integer getMasterMinPrice();
    }
}