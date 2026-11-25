@Entity
@Table(name = "Izbran_fak")
public class IzbranFak {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "izbran_fak_seq")
    @SequenceGenerator(name = "izbran_fak_seq", sequenceName = "\"Izbran_fak_ID_Izbr_fak_seq\"", allocationSize = 1)
    @Column(name = "ID_Izbr_fak")
    private Long id;

    @Column(name = "ID_User")
    private Long userId;

    @Column(name = "ID_Fakultet")
    private Long fakultetId;

    public IzbranFak() {}

    public IzbranFak(Long userId, Long fakultetId) {
        this.userId = userId;
        this.fakultetId = fakultetId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getFakultetId() { return fakultetId; }
}
