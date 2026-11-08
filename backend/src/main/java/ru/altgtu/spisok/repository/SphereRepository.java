package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.altgtu.spisok.entity.Sphere;

import java.util.List;

public interface SphereRepository extends JpaRepository<Sphere, Integer> {

    @Query(value = """
    SELECT
        s."ID_Sphere"   AS id,
        s."Name"        AS name,
        s."Opisanie"    AS opisanie,
        s."Logo_Url"    AS logoUrl,
        COUNT(DISTINCT sn."ID_Napravlenie") AS cnt,
        COUNT(DISTINCT sp."ID_Profession") AS profCnt
    FROM "Sphere" s
    LEFT JOIN "Sphere_napravlenie" sn ON sn."ID_Sphere" = s."ID_Sphere"
    LEFT JOIN "Sphere_profession" sp ON sp."ID_Sphere" = s."ID_Sphere"
    GROUP BY s."ID_Sphere", s."Name", s."Opisanie", s."Logo_Url"
    ORDER BY s."ID_Sphere"
    """, nativeQuery = true)
    List<SphereWithCountProjection> findAllWithCounts();

    interface SphereWithCountProjection {
        Integer getId();
        String getName();
        String getOpisanie();
        String getLogoUrl();
        Long getCnt();
        Long getProfCnt(); // 👈 новое поле
    }
}