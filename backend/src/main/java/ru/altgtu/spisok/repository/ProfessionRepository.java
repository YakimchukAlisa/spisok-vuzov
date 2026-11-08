package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.altgtu.spisok.entity.Profession;

import java.util.List;

public interface ProfessionRepository extends JpaRepository<Profession, Integer> {

    // Запрос, который достает профессии, связанные с конкретной сферой через таблицу Sphere_profession
    @Query(value = """
        SELECT p."ID_Profession" AS id, p."Name" AS name, p."Description" AS description
        FROM "Profession" p
        JOIN "Sphere_profession" sp ON sp."ID_Profession" = p."ID_Profession"
        WHERE sp."ID_Sphere" = :sphereId
        """, nativeQuery = true)
    List<ProfessionDtoProjection> findProfessionsBySphereId(@Param("sphereId") Integer sphereId);

    @Query(value = """
        SELECT COUNT(DISTINCT p."ID_Profession")
        FROM "Profession" p
        JOIN "Profession_napravlenie" pn ON pn."ID_Profession" = p."ID_Profession"
        JOIN "Napravlenie" n ON n."ID_Napravlenie" = pn."ID_Napravlenie"
        WHERE n."Kod" = :kod
        """, nativeQuery = true)
    Long countProfessionsBySphereAndKod(@Param("kod") String kod);

    interface ProfessionDtoProjection {
        Integer getId();
        String getName();
        String getDescription();
    }

    @Query(value = """
    SELECT DISTINCT p.*
    FROM "Profession" p
    JOIN "Profession_napravlenie" pn ON pn."ID_Profession" = p."ID_Profession"
    JOIN "Napravlenie" n ON n."ID_Napravlenie" = pn."ID_Napravlenie"
    WHERE n."Kod" = :kod
    """, nativeQuery = true)
    List<Profession> findProfessionsByNapravlenieKod(@Param("kod") String kod);
}