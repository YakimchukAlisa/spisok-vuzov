package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.dto.VuzCardDto;
import ru.altgtu.spisok.dto.VuzDto;
import ru.altgtu.spisok.entity.Vuz;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface VuzRepository extends JpaRepository<Vuz, Integer> {

    @Query(value = """
        SELECT 
            v."ID_Vuz" AS id, 
            v."Abbreviatura" AS name, 
            v."Name" AS fullName,
            v."Image_Url" AS imageUrl,
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
        GROUP BY v."ID_Vuz", v."Abbreviatura", v."Name", v."Logo_Url"
        """, nativeQuery = true)
    List<VuzCardDto> findAllVuzCards();

    @Query(value = """
        SELECT 
            v."ID_Vuz" AS id, 
            v."Name" AS name, 
            v."Abbreviatura" AS abbreviatura,
            v."Opisanie" AS opisanie,
            v."Adress" AS adress,
            v."Site" AS site,
            v."Email" AS email,
            v."Phone" AS phone,
            v."Image_Url" AS imageUrl,
            v."Logo_Url" AS logoUrl,
            v."VK_Url" AS vkUrl,
            v."Telegram_Url" AS telegramUrl,
            v."Max_Url" AS maxUrl,
            
            CAST(COALESCE(SUM(CASE WHEN o."Name" = 'Бюджетная основа' THEN pi."Kol_mest" ELSE 0 END), 0) AS integer) AS budgetPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Бюджетная основа' AND u."Name" = 'Бакалавриат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS budgetMinScore,
            CAST(COALESCE(SUM(CASE WHEN o."Name" = 'Полное возмещение затрат' THEN pi."Kol_mest" ELSE 0 END), 0) AS integer) AS paidPlaces,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND u."Name" = 'Бакалавриат' AND pi."Prohodnoi" > 0 THEN pi."Prohodnoi" END), 0) AS integer) AS paidMinScore,
            CAST(COALESCE(MIN(CASE WHEN o."Name" = 'Полное возмещение затрат' AND u."Name" = 'Бакалавриат' AND pi."Stoimost" > 0 THEN pi."Stoimost" END), 0) AS integer) AS paidMinPrice
        FROM "Vuz" v
        LEFT JOIN "Fakultet" f ON f."ID_Vuz" = v."ID_Vuz"
        LEFT JOIN "Napravlenie" n ON n."ID_Fakultet" = f."ID_Fakultet"
        LEFT JOIN "Profile" p ON p."ID_Napravlenie" = n."ID_Napravlenie"
        LEFT JOIN "Ur_obraz" u ON u."ID_Ur" = p."ID_Ur"
        LEFT JOIN "Post_info" pi ON pi."ID_Profile" = p."ID_Profile"
        LEFT JOIN "Osnov_priema" o ON o."ID_Osnov" = pi."ID_Osnov"
        WHERE v."ID_Vuz" = :id
       GROUP BY v."ID_Vuz", v."Name", v."Abbreviatura", v."Opisanie", v."Adress", v."Site", v."Email", v."Phone", v."VK_Url", v."Telegram_Url", v."Max_Url", v."Image_Url", v."Logo_Url"
        """, nativeQuery = true)
    VuzDto findVuzDetailsById(@Param("id") Integer id);
}



