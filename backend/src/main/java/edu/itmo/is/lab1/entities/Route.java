package edu.itmo.is.lab1.entities;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "routes")
@Getter @Setter @NoArgsConstructor
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // >0 генерится БД

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Valid
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "x", column = @Column(name = "coord_x", nullable = false)),
            @AttributeOverride(name = "y", column = @Column(name = "coord_y", nullable = false))
    })
    private Coordinates coordinates;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, name = "creation_date", updatable = false)
    private Date creationDate;

    @ManyToOne
    @JoinColumn(name = "from_location_id")
    private Location from; // может быть null

    @ManyToOne
    @JoinColumn(name = "to_location_id")
    private Location to;   // может быть null

    @DecimalMin(value = "1.0", inclusive = false)
    @Column
    private Double distance; // null или >1

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false)
    private Double rating; // >0

    @PrePersist
    void onCreate() {
        if (creationDate == null) creationDate = new Date();
    }
}
