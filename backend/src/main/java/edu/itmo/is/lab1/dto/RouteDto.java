package edu.itmo.is.lab1.dto;

import edu.itmo.is.lab1.entities.Location;
import edu.itmo.is.lab1.entities.Route;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class RouteDto {
    private Integer id;

    @NotBlank
    private String name;

    @NotNull
    private Double rating;

    private Double distance;

    private Coordinates coordinates = new Coordinates();

    // для простого биндинга по id, как шлёт фронт
    private Ref from;
    private Ref to;

    private Instant creationDate;

    @Data
    public static class Coordinates {
        private Double x;
        private Double y;
    }

    @Data
    public static class Ref {
        private Integer id;
        private String name; // необяз., может приходить null
    }

    public static RouteDto fromEntity(Route r) {
        RouteDto dto = new RouteDto();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setRating(r.getRating());
        dto.setDistance(r.getDistance());
        Coordinates c = new Coordinates();
        c.setX(r.getCoordX());
        c.setY(r.getCoordY());
        dto.setCoordinates(c);
        if (r.getFrom() != null) {
            Ref ref = new Ref(); ref.setId(r.getFrom().getId()); ref.setName(r.getFrom().getName());
            dto.setFrom(ref);
        }
        if (r.getTo() != null) {
            Ref ref = new Ref(); ref.setId(r.getTo().getId()); ref.setName(r.getTo().getName());
            dto.setTo(ref);
        }
        dto.setCreationDate(r.getCreationDate());
        return dto;
    }

    /** Готовит «тонкие» сущности (по id), чтобы сервис мог сохранить/обновить. */
    public Route toEntity() {
        Route r = new Route();
        r.setId(this.id);
        r.setName(this.name);
        r.setRating(this.rating);
        r.setDistance(this.distance);
        if (this.coordinates != null) {
            r.setCoordX(this.coordinates.getX());
            r.setCoordY(this.coordinates.getY());
        }
        if (this.from != null && this.from.getId() != null) {
            Location l = new Location(); l.setId(this.from.getId()); r.setFrom(l);
        }
        if (this.to != null && this.to.getId() != null) {
            Location l = new Location(); l.setId(this.to.getId()); r.setTo(l);
        }
        return r;
    }
}
