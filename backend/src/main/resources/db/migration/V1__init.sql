-- coordinates (как отдельная сущность)
CREATE TABLE coordinates (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  x             REAL NOT NULL,
  y             DOUBLE PRECISION NOT NULL CHECK (y <= 49)
);

-- location
CREATE TABLE location (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  x             BIGINT NOT NULL,
  y             REAL NOT NULL,
  name          TEXT  NOT NULL CHECK (length(trim(name)) > 0)
);

-- route
CREATE TABLE route (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           TEXT NOT NULL CHECK (length(trim(name)) > 0),
  coordinates_id INTEGER NOT NULL REFERENCES coordinates(id) ON DELETE RESTRICT,
  creation_date  TIMESTAMPTZ NOT NULL DEFAULT now(),
  from_id        BIGINT REFERENCES location(id) ON DELETE RESTRICT,
  to_id          BIGINT REFERENCES location(id) ON DELETE RESTRICT,
  distance       DOUBLE PRECISION CHECK (distance IS NULL OR distance > 1),
  rating         DOUBLE PRECISION NOT NULL CHECK (rating > 0)
);

CREATE INDEX idx_route_name ON route (name);
