package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.altgtu.spisok.entity.Napravlenie;
import java.util.List;

public interface NapravlenieRepository extends JpaRepository<Napravlenie, Integer> {

    // Возвращает направления конкретного вуза
    @Query("SELECT n FROM Napravlenie n WHERE n.fakultet.vuz.id = :vuzId")
    List<Napravlenie> findByVuzId(@Param("vuzId") Integer vuzId);

    // Получить базовые данные направлений (без статистики) через проекцию
    @Query(value = """
        SELECT 
            n."ID_Napravlenie" AS id,
            n."Kod" AS kod,
            n."Name" AS name,
            n."Opisanie" AS opisanie,
            f."ID_Fakultet" AS fakultetId,
            f."Name" AS fakultet,
            (SELECT u."Name" FROM "Profile" p2 JOIN "Ur_obraz" u ON u."ID_Ur" = p2."ID_Ur" WHERE p2."ID_Napravlenie" = n."ID_Napravlenie" LIMIT 1) AS uroven,
            COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS budgetPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
            COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS paidPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice
        FROM "Napravlenie" n
        JOIN "Fakultet" f ON f."ID_Fakultet" = n."ID_Fakultet"
        LEFT JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
        WHERE f."ID_Vuz" = :vuzId
        GROUP BY n."ID_Napravlenie", n."Kod", n."Name", n."Opisanie", f."ID_Fakultet", f."Name"
        """, nativeQuery = true)
    List<NapravlenieStatsProjection> findNapravleniyaWithStatsByVuzId(@Param("vuzId") Integer vuzId);

    // НОВЫЙ запрос 1: все экзамены (ЕГЭ) для всех направлений вуза — ОДИН запрос
    @Query(value = """
        SELECT DISTINCT
            n."ID_Napravlenie" AS napravlenieId,
            e."Name" AS examName
        FROM "Napravlenie" n
        JOIN "Fakultet" f ON f."ID_Fakultet" = n."ID_Fakultet"
        JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        JOIN "Ispitania" isp ON isp."ID_Info" = pi."ID_Info"
        JOIN "Treb_exam" te ON te."ID_Ispit" = isp."ID_Ispit"
        JOIN "Exam" e ON e."ID_Exam" = te."ID_Exam"
        WHERE f."ID_Vuz" = :vuzId
          AND te."Forma_sdachi" ILIKE '%ЕГЭ%'
        """, nativeQuery = true)
    List<NapravlenieExamProjection> findExamsByVuzId(@Param("vuzId") Integer vuzId);

    // НОВЫЙ запрос 2: все профили с их статистикой для всех направлений вуза — ОДИН запрос
    @Query(value = """
        SELECT
            p."ID_Napravlenie" AS napravlenieId,
            p."ID_Profile" AS profileId,
            p."Name" AS profileName,
            fo."Name" AS forma,
            p."Srok_obuch_mes" AS srokObuchMes,
            COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS budgetPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
            COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS paidPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice
        FROM "Fakultet" f
        JOIN "Napravlenie" n ON n."ID_Fakultet" = f."ID_Fakultet"
        JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        LEFT JOIN "Form_obuch" fo ON fo."ID_Form" = p."ID_Form"
        LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
        WHERE f."ID_Vuz" = :vuzId
        GROUP BY p."ID_Napravlenie", p."ID_Profile", p."Name", fo."Name", p."Srok_obuch_mes"
        """, nativeQuery = true)
    List<ProfileStatsForVuzProjection> findProfileStatsByVuzId(@Param("vuzId") Integer vuzId);

    // Интерфейс-проекция для findNapravleniyaWithStatsByVuzId
    interface NapravlenieStatsProjection {
        Integer getId();
        String getKod();
        String getName();
        String getOpisanie();
        Integer getFakultetId();
        String getFakultet();
        String getUroven();
        Integer getBudgetPlaces();
        Integer getBudgetMinScore();
        Integer getPaidPlaces();
        Integer getPaidMinScore();
        Integer getPaidMinPrice();
    }

    // Интерфейс-проекция для findExamsByVuzId
    interface NapravlenieExamProjection {
        Integer getNapravlenieId();
        String getExamName();
    }

    // Интерфейс-проекция для findProfileStatsByVuzId
    interface ProfileStatsForVuzProjection {
        Integer getNapravlenieId();
        Integer getProfileId();
        String getProfileName();
        String getForma();
        Integer getSrokObuchMes();
        Integer getBudgetPlaces();
        Integer getBudgetMinScore();
        Integer getPaidPlaces();
        Integer getPaidMinScore();
        Integer getPaidMinPrice();
    }
}