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
}