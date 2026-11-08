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
        (SELECT COUNT(DISTINCT n."Name") 
         FROM "Sphere_napravlenie" sn 
         JOIN "Napravlenie" n ON n."ID_Napravlenie" = sn."ID_Napravlenie" 
         WHERE sn."ID_Sphere" = s."ID_Sphere") AS cnt,
         
        (SELECT COUNT(DISTINCT p."ID_Profession") 
         FROM "Sphere_profession" sp 
         JOIN "Profession" p ON p."ID_Profession" = sp."ID_Profession" 
         WHERE sp."ID_Sphere" = s."ID_Sphere") AS profCnt
    FROM "Sphere" s
    ORDER BY s."ID_Sphere"
    """, nativeQuery = true)
    List<SphereWithCountProjection> findAllWithCounts();

    interface SphereWithCountProjection {
        Integer getId();
        String getName();
        String getOpisanie();
        String getLogoUrl();
        Long getCnt();
        Long getProfCnt();
    }
}