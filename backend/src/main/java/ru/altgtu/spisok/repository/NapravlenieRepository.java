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
        u."Name" AS uroven, 
        COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS budgetPlaces,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
        COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS paidPlaces,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice
    FROM "Fakultet" f
    JOIN "Napravlenie" n ON n."ID_Fakultet" = f."ID_Fakultet"
    JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
    JOIN "Form_obuch" fo ON fo."ID_Form" = p."ID_Form"
    JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur"
    LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
    LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
    WHERE f."ID_Vuz" = :vuzId
    GROUP BY p."ID_Napravlenie", p."ID_Profile", p."Name", fo."Name", p."Srok_obuch_mes", u."Name"
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
        Integer getBudgetPlaces();
        Integer getBudgetMinScore();
        Integer getPaidPlaces();
        Integer getPaidMinScore();
        Integer getPaidMinPrice();
        String getUroven();
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
        String getUroven();
    }

    @Query(value = """
    SELECT sn."ID_Napravlenie" AS napravlenieId, s."ID_Sphere" AS sphereId
    FROM "Sphere_napravlenie" sn
    JOIN "Sphere" s ON s."ID_Sphere" = sn."ID_Sphere"
    JOIN "Napravlenie" n ON n."ID_Napravlenie" = sn."ID_Napravlenie"
    JOIN "Fakultet" f ON f."ID_Fakultet" = n."ID_Fakultet"
    WHERE f."ID_Vuz" = :vuzId
    """, nativeQuery = true)
    List<NapravlenieSphereProjection> findSpheresByVuzId(@Param("vuzId") Integer vuzId);

    // 1. Найти все направления по коду (например, "09.03.01")
    List<Napravlenie> findByKod(String kod);

    // 2. Найти направления, связанные с профессиями из списка
    @Query("SELECT DISTINCT n FROM Napravlenie n JOIN n.professions p WHERE p.id IN :profIds")
    List<Napravlenie> findByProfessionIds(@Param("profIds") List<Integer> profIds);

    // 3. Найти направления по ID сферы
    @Query("SELECT n FROM Napravlenie n JOIN n.spheres s WHERE s.id = :sphereId")
    List<Napravlenie> findBySphereId(@Param("sphereId") Integer sphereId); // Замените старый нативный метод на этот

    @Query(value = """
    SELECT
        MIN(n."ID_Napravlenie")      AS id,
        MIN(n."Kod")                  AS kod,
        n."Name"                      AS name,
        MIN(n."Opisanie")             AS opisanie,
        COUNT(DISTINCT f."ID_Vuz")    AS vuzCount,
        MIN(u."Name")                 AS uroven,     
        MIN(s."Logo_Url")             AS logoUrl  
    FROM "Napravlenie" n
    JOIN "Fakultet" f            ON f."ID_Fakultet"     = n."ID_Fakultet"
    JOIN "Sphere_napravlenie" sn ON sn."ID_Napravlenie" = n."ID_Napravlenie"
    JOIN "Sphere" s              ON s."ID_Sphere"       = sn."ID_Sphere"  
    JOIN "Profile" p             ON p."ID_Napravlenie"  = n."ID_Napravlenie"
    JOIN "Ur_obraz" u            ON u."ID_Ur"           = p."ID_Ur"
    WHERE sn."ID_Sphere" = :sphereId
    GROUP BY n."Name"             
    ORDER BY n."Name"
    """, nativeQuery = true)
    List<AbstractNapravlenieProjection> findAbstractBySphereId(@Param("sphereId") Integer sphereId);

    interface NapravlenieSphereProjection {
        Integer getNapravlenieId();
        Integer getSphereId();
    }

    public interface AbstractNapravlenieProjection {
        Integer getId();
        String getKod();
        String getName();
        String getOpisanie();
        Long getVuzCount();
        String getUroven();
        String getLogoUrl();
    }
    @Query(value = """
    SELECT COUNT(DISTINCT n."Name")
    FROM "Napravlenie" n
    JOIN "Profession_napravlenie" pn ON pn."ID_Napravlenie" = n."ID_Napravlenie"
    WHERE pn."ID_Profession" = :professionId
    """, nativeQuery = true)
    Long countSpecialtiesByProfessionId(@Param("professionId") Integer professionId);

    @Query(value = """
    SELECT DISTINCT e."Name"
    FROM "Napravlenie" n
    JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
    JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
    JOIN "Ispitania" isp ON isp."ID_Info" = pi."ID_Info"
    JOIN "Treb_exam" te ON te."ID_Ispit" = isp."ID_Ispit"
    JOIN "Exam" e ON e."ID_Exam" = te."ID_Exam"
    WHERE n."Kod" = :kod 
      AND te."Forma_sdachi" ILIKE '%ЕГЭ%'
    """, nativeQuery = true)
    List<String> findExamsByKod(@Param("kod") String kod);

}