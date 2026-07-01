import statesGeo from "./dev/us-states.geo.json";

/**
 * Continental-US outline projector, shared by the "coast to coast" campus tour
 * graphic. It projects every lower-48 state polygon from the bundled Census
 * GeoJSON into one fixed viewBox (equirectangular with a cos(midLat) aspect
 * correction so the map is not horizontally stretched) and exposes the exact
 * same projection so campus lat/lng land on the map where they really are. Pure
 * geometry from real Census shapes and real university coordinates, computed
 * once at module load. No fetching, nothing invented.
 */

type Ring = number[][];
type Polygon = Ring[];
interface GeoFeature {
  properties: { name: string };
  geometry:
    | { type: "Polygon"; coordinates: Polygon }
    | { type: "MultiPolygon"; coordinates: Polygon[] };
}

const FEATURES = (statesGeo as { features: GeoFeature[] }).features;

// Non-continental territories are dropped so the sweep reads as one landmass.
const EXCLUDE = new Set(["Alaska", "Hawaii", "Puerto Rico"]);

const CONTINENTAL = FEATURES.filter((f) => !EXCLUDE.has(f.properties.name));

// Bounds across every ring of every included state.
let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const f of CONTINENTAL) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
}

const midLat = (minLat + maxLat) / 2;
const kx = Math.cos((midLat * Math.PI) / 180);
const spanX = Math.max((maxLng - minLng) * kx, 1e-6);
const spanY = Math.max(maxLat - minLat, 1e-6);

/** Fixed drawing width; height preserves the projected aspect ratio. */
export const NATION_W = 960;
export const NATION_H = Math.round((spanY / spanX) * NATION_W * 100) / 100;

const scaleX = NATION_W / spanX;
const scaleY = NATION_H / spanY;

/** Project a live lng/lat into the national viewBox. */
export function projectLngLat(lng: number, lat: number): { x: number; y: number } {
  return {
    x: Math.round((lng - minLng) * kx * scaleX * 100) / 100,
    y: Math.round((maxLat - lat) * scaleY * 100) / 100, // flip Y for SVG
  };
}

/** One SVG path per state (stroked, un-filled) so internal borders show. */
export const STATE_PATHS: { name: string; d: string }[] = CONTINENTAL.map((f) => {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const parts: string[] = [];
  for (const poly of polys) {
    for (const ring of poly) {
      if (ring.length < 2) continue;
      let seg = "";
      ring.forEach(([lng, lat], i) => {
        const { x, y } = projectLngLat(lng, lat);
        seg += `${i === 0 ? "M" : "L"}${x} ${y}`;
      });
      parts.push(seg + "Z");
    }
  }
  return { name: f.properties.name, d: parts.join(" ") };
});
