package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.altgtu.spisok.entity.PostInfo;

import java.util.List;

@Repository
public interface PostInfoRepository extends JpaRepository<PostInfo, Integer> {

    // Найти все условия приёма для конкретного профиля
    @Query("SELECT pi FROM PostInfo pi " +
            "JOIN FETCH pi.osnovPriema " +
            "WHERE pi.profile.id = :profileId")
    List<PostInfo> findByProfileId(@Param("profileId") Integer profileId);
}