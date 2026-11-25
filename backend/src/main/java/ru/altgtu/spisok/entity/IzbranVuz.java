@Entity
@Table(name = "Izbran_vuz")
public class IzbranVuz {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "izbran_vuz_seq")
    @SequenceGenerator(name = "izbran_vuz_seq", sequenceName = "\"Izbran_vuz_ID_IZbr_vuz_seq\"", allocationSize = 1)
    @Column(name = "ID_IZbr_vuz")
    private Long id;

    @Column(name = "ID_User")
    private Long userId;

    @Column(name = "ID_Vuz")
    private Long vuzId;

    public IzbranVuz() {}

    public IzbranVuz(Long userId, Long vuzId) {
        this.userId = userId;
        this.vuzId = vuzId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getVuzId() { return vuzId; }
}
