import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Prof_test")
@Data
public class ProfTest {
    @Id
    @Column(name = "ID_Test")
    private Integer id;

    @Column(name = "Opisanie", nullable = false)
    private String opisanie;
}