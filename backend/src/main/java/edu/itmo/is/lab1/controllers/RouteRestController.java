package edu.itmo.is.lab1.controllers;

import edu.itmo.is.lab1.dto.RouteDto;
import edu.itmo.is.lab1.entities.Route;
import edu.itmo.is.lab1.services.RouteService;
import edu.itmo.is.lab1.websocket.Topics;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/routes")
public class RouteRestController {

    private final RouteService service;
    private final SimpMessagingTemplate ws;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<RouteDto> list(@RequestParam(required = false) String column,
                               @RequestParam(required = false) String equals,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "id,asc") String sort) {
        String[] parts = sort.split(",");
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(parts[1]), parts[0]));
        Page<Route> routes = service.list(column, equals, pageable);
        return routes.map(RouteDto::fromEntity);
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public RouteDto get(@PathVariable Integer id) {
        return RouteDto.fromEntity(service.get(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public RouteDto create(@Valid @RequestBody RouteDto dto) {
        Route saved = service.create(dto.toEntity());
        ws.convertAndSend(Topics.ROUTES, "changed");
        return RouteDto.fromEntity(saved);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public RouteDto update(@PathVariable Integer id, @Valid @RequestBody RouteDto dto) {
        Route saved = service.update(id, dto.toEntity());
        ws.convertAndSend(Topics.ROUTES, "changed");
        return RouteDto.fromEntity(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
        ws.convertAndSend(Topics.ROUTES, "changed");
    }

    // --- OPS для фронта ---
    @PostMapping(path = "/ops/deleteByRating")
    public long deleteByRating(@RequestParam Double rating) {
        long n = service.deleteByRating(rating);
        ws.convertAndSend(Topics.ROUTES, "changed");
        return n;
    }

    @GetMapping(path = "/ops/countByRating")
    public long countByRating(@RequestParam Double rating) {
        return service.countByRating(rating);
    }

    // если у тебя есть другие операции — добавь их по тем урлам,
    // которые вызывает фронт: /ops/lessThanRating, /ops/path, /ops/addBetween
}
