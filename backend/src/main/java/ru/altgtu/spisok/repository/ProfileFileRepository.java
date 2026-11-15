package ru.altgtu.spisok.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.altgtu.spisok.entity.ProfileFile;
import java.util.List;

public interface ProfileFileRepository extends JpaRepository<ProfileFile, Integer> {
    List<ProfileFile> findByProfileId(Integer profileId);
}