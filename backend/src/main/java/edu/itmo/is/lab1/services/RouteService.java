package edu.itmo.is.lab1.services;

import edu.itmo.is.lab1.entities.Location;
import edu.itmo.is.lab1.entities.Route;
import edu.itmo.is.lab1.repositories.LocationRepository;
import edu.itmo.is.lab1.repositories.RouteRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routes;
    private final LocationRepository locations;

    public Page<Route> list(String column, String equals, Pageable pageable) {
        if (column == null || equals == null || equals.isBlank()) {
            return routes.findAll(pageable);
        }
        return switch (column) {
            case "name" -> routes.findByName(equals, pageable);
            case "from" -> routes.findByFrom_Name(equals, pageable);
            case "to"   -> routes.findByTo_Name(equals, pageable);
            default -> routes.findAll(pageable);
        };
    }

    public Route get(Integer id) {
        return routes.findById(id).orElseThrow(() -> new EntityNotFoundException("Route not found"));
    }

    @Transactional
    public Route create(@Valid Route r) { return routes.save(r); }

    @Transactional
    public Route update(Integer id, @Valid Route patch) {
        Route r = get(id);
        r.setName(patch.getName());
        r.setCoordinates(patch.getCoordinates());
        r.setFrom(patch.getFrom());
        r.setTo(patch.getTo());
        r.setDistance(patch.getDistance());
        r.setRating(patch.getRating());
        return r;
    }

    @Transactional
    public void delete(Integer id) { routes.deleteById(id); }

    // спец-операции
    @Transactional public long deleteByRating(Double rating) { return routes.deleteByRating(rating); }
    public long countByRating(Double rating) { return routes.countByRating(rating); }
    public List<Route> lessThanRating(Double rating) { return routes.findByRatingLessThan(rating); }

    // кратчайший/длиннейший путь по локациям с учётом distance
    public List<Route> shortestPath(String fromName, String toName, boolean longest) {
        Location from = locations.findByName(fromName).orElseThrow();
        Location to   = locations.findByName(toName).orElseThrow();

        // строим граф: Location -> (Route -> сосед)
        Map<Location, List<Route>> out = new HashMap<>();
        for (Route r : routes.findAll()) {
            if (r.getFrom() != null && r.getTo() != null && r.getDistance() != null) {
                out.computeIfAbsent(r.getFrom(), k -> new ArrayList<>()).add(r);
            }
        }

        // Дейкстра (для «длиннейшего» — инвертируем вес: -distance)
        record Node(Location loc, double dist) {}
        Map<Location, Double> best = new HashMap<>();
        Map<Location, Route>  prevEdge = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>(Comparator.comparingDouble(Node::dist));

        best.put(from, 0.0);
        pq.add(new Node(from, 0.0));

        while (!pq.isEmpty()) {
            Node cur = pq.poll();
            if (cur.loc.equals(to)) break;
            for (Route e : out.getOrDefault(cur.loc, List.of())) {
                double w = longest ? -e.getDistance() : e.getDistance();
                double nd = cur.dist + w;
                Location v = e.getTo();
                if (best.getOrDefault(v, Double.POSITIVE_INFINITY) > nd) {
                    best.put(v, nd);
                    prevEdge.put(v, e);
                    pq.add(new Node(v, nd));
                }
            }
        }

        if (!prevEdge.containsKey(to)) return List.of(); // пути нет

        // восстановить ребра
        List<Route> path = new ArrayList<>();
        Location cur = to;
        while (!cur.equals(from)) {
            Route e = prevEdge.get(cur);
            path.add(e);
            cur = e.getFrom();
        }
        Collections.reverse(path);
        return path;
    }

    @Transactional
    public Route addRouteBetween(String fromName, String toName, double distance, double rating) {
        Location from = locations.findByName(fromName).orElseThrow();
        Location to   = locations.findByName(toName).orElseThrow();

        Route r = new Route();
        r.setName(from.getName() + " -> " + to.getName());
        r.setCoordinates(new edu.itmo.is.lab1.entities.Coordinates(0f, 0)); // обязательное поле
        r.setFrom(from);
        r.setTo(to);
        r.setDistance(distance);
        r.setRating(rating);
        return routes.save(r);
    }
}
