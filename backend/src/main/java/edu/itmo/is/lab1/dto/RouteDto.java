package edu.itmo.is.lab1.dto;

import edu.itmo.is.lab1.entities.Location;
import edu.itmo.is.lab1.entities.Route;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class RouteDto {
    private Integer id;

    @NotBlank
    private String name;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private Double rating;          // > 0

    @DecimalMin(value = "1.0", inclusive = false)
    private Double distance;        // null или > 1

    // JSON как на фронте: { "coordinates": { "x": ..., "y": ... } }
    @Valid
    private Coordinates coordinates = new Coordinates();

    // фронт шлёт { "from": { "id": 1 }, "to": { "id": 2 } }
    private Ref from;
    private Ref to;

    private Date creationDate;

    @Data
    public static class Coordinates {
        // типы как в модели: x = float, y = double
        private Float x;
        @DecimalMax(value = "49")
        private Double y;
    }

    @Data
    public static class Ref {
        private Long id;      // как в Location
        private String name;  // опционально (для отдачи на фронт)
    }

    /* ---------------- mapping ---------------- */

    public static RouteDto fromEntity(Route r) {
        RouteDto dto = new RouteDto();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setRating(r.getRating());
        dto.setDistance(r.getDistance());

        Coordinates c = new Coordinates();
        if (r.getCoordinates() != null) {
            // float -> Float, double -> Double
            c.setX(r.getCoordinates().getX());
            c.setY(r.getCoordinates().getY());
        }
        dto.setCoordinates(c);

        if (r.getFrom() != null) {
            Ref ref = new Ref();
            ref.setId(r.getFrom().getId());
            ref.setName(r.getFrom().getName());
            dto.setFrom(ref);
        }
        if (r.getTo() != null) {
            Ref ref = new Ref();
            ref.setId(r.getTo().getId());
            ref.setName(r.getTo().getName());
            dto.setTo(ref);
        }

        dto.setCreationDate(r.getCreationDate());
        return dto;
    }

    public Route toEntity() {
        Route r = new Route();
        r.setId(this.id);
        r.setName(this.name);
        r.setRating(this.rating);
        r.setDistance(this.distance);

        if (this.coordinates != null) {
            edu.itmo.is.lab1.entities.Coordinates coords =
                    new edu.itmo.is.lab1.entities.Coordinates();
            if (this.coordinates.getX() != null) coords.setX(this.coordinates.getX()); // Float -> float
            if (this.coordinates.getY() != null) coords.setY(this.coordinates.getY()); // Double -> double
            r.setCoordinates(coords);
        }

        if (this.from != null && this.from.getId() != null) {
            Location l = new Location();
            l.setId(this.from.getId()); // Long
            r.setFrom(l);
        }
        if (this.to != null && this.to.getId() != null) {
            Location l = new Location();
            l.setId(this.to.getId()); // Long
            r.setTo(l);
        }

        // creationDate выставит @PrePersist в entity
        return r;
    }
}
