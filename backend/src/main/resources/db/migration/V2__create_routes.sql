-- Локации (минимально необходимые поля)
CREATE TABLE IF NOT EXISTS locations (
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    x    DOUBLE PRECISION NOT NULL,
    y    DOUBLE PRECISION NOT NULL,
    z    DOUBLE PRECISION
);

-- Маршруты (поля по логам: id, creation_date, distance, name, rating, coord_x, coord_y,
--           from_location_id, to_location_id)
CREATE TABLE IF NOT EXISTS routes (
    id               BIGSERIAL PRIMARY KEY,
    creation_date    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    distance         DOUBLE PRECISION NOT NULL CHECK (distance > 0),
    name             VARCHAR(255) NOT NULL,
    rating           INTEGER,
    coord_x          DOUBLE PRECISION NOT NULL,
    coord_y          DOUBLE PRECISION NOT NULL,
    from_location_id BIGINT,
    to_location_id   BIGINT,
    CONSTRAINT fk_routes_from_location FOREIGN KEY (from_location_id) REFERENCES locations(id) ON DELETE SET NULL,
    CONSTRAINT fk_routes_to_location   FOREIGN KEY (to_location_id)   REFERENCES locations(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_routes_name    ON routes (name);
CREATE INDEX IF NOT EXISTS idx_routes_rating  ON routes (rating);
CREATE INDEX IF NOT EXISTS idx_routes_order   ON routes (id);

-- Немного демо-данных (по желанию — можно закомментировать)
INSERT INTO locations (name, x, y, z) VALUES
  ('A', 0, 0, 0),
  ('B', 1, 1, 1)
ON CONFLICT DO NOTHING;

INSERT INTO routes (name, rating, distance, coord_x, coord_y, from_location_id, to_location_id)
VALUES ('Test route', 5, 10.5, 59.9, 30.3, 1, 2)
ON CONFLICT DO NOTHING;
