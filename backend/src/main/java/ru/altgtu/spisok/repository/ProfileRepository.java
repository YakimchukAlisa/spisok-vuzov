package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.Profile;

import java.util.List;
import java.util.Map;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Integer> {

    // Найти все профили по ID направления
    @Query("SELECT p FROM Profile p " +
            "JOIN FETCH p.formObuch " +
            "JOIN FETCH p.urObraz " +
            "WHERE p.napravlenie.id = :napravlenieId")
    List<Profile> findByNapravlenieId(@Param("napravlenieId") Integer napravlenieId);

    @Query(value = """
    SELECT DISTINCT p."ID_Profile" AS id, p."Name" AS name, 
                    n."ID_Napravlenie" AS napravlenieId, n."Name" AS napravlenieName, 
                    n."Kod" AS kod, u."Name" AS uroven, fo."Name" AS forma
    FROM "Profile" p
    JOIN "Napravlenie" n ON n."ID_Napravlenie" = p."ID_Napravlenie"
    JOIN "Sphere_napravlenie" sn ON sn."ID_Napravlenie" = n."ID_Napravlenie"
    JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur"
    JOIN "Form_obuch" fo ON fo."ID_Form" = p."ID_Form"
    WHERE sn."ID_Sphere" = :sphereId
    """, nativeQuery = true)
    List<ProfileForSphereProjection> findProfilesBySphereId(@Param("sphereId") Integer sphereId);

    interface ProfileForSphereProjection {
        Integer getId();
        String getName();
        Integer getNapravlenieId();
        String getNapravlenieName();
        String getKod();
        String getUroven();
        String getForma();
    }

    @Query(value = """
    SELECT 
        p."ID_Profile" AS id,
        p."Name" AS name,
        n."Name" AS napravlenieName,
        n."Kod" AS kod,
        n."Opisanie" AS opisanie,
        f."Name" AS fakultetName,
        f."Logo_Url" AS fakultetLogo,
        v."Name" AS vuzName,
        fo."Name" AS forma,
        u."Name" AS uroven,
        p."Srok_obuch_mes" AS srokObuchMes,
        v."ID_Vuz" AS vuzId,      
        f."ID_Fakultet" AS facultyId,
        -- Считаем бюджет
        COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS budgetPlaces,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
        -- Считаем платно
        COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS paidPlaces,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
        CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice
    FROM "Profile" p
    JOIN "Napravlenie" n ON n."ID_Napravlenie" = p."ID_Napravlenie"
    JOIN "Fakultet" f ON f."ID_Fakultet" = n."ID_Fakultet"
    JOIN "Vuz" v ON v."ID_Vuz" = f."ID_Vuz"
    JOIN "Form_obuch" fo ON fo."ID_Form" = p."ID_Form"
    JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur"
    LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
    LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
    WHERE p."ID_Profile" = :profileId
            GROUP BY
                    p."ID_Profile", p."Name",
                    n."Name", n."Kod", n."Opisanie",
                    f."Name", f."Logo_Url", f."ID_Fakultet",  
                    v."Name", v."ID_Vuz",                       
                    fo."Name", u."Name", p."Srok_obuch_mes"
    """, nativeQuery = true)
    Map<String, Object> findProfileWithStatsById(@Param("profileId") Integer profileId);
}