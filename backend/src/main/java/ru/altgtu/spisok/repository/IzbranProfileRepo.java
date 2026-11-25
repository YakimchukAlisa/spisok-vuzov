package ru.altgtu.spisok.repository;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.altgtu.spisok.entity.IzbranProfile;

import java.util.List;
import java.util.Optional;

public interface IzbranNapravRepo extends JpaRepository<IzbranProfile, Integer> {
    List<IzbranProfile> findByUserId(Integer userId);
    Optional<IzbranProfile> findByUserIdAndNapravlenieId(Integer userId, Integer napravlenieId);
    @Transactional
    void deleteByUserIdAndNapravlenieId(Integer userId, Integer napravlenieId);
}
