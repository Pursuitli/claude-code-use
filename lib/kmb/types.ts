/**
 * TypeScript types for the KMB / LWB Open Data ETA API.
 * Base URL: https://data.etabus.gov.hk/v1/transport/kmb
 *
 * Every endpoint returns an envelope of shape { type, version, generated_timestamp, data }.
 * Fields that the API may return as `null` are typed as `| null` so the UI parses defensively.
 */

/** Generic response envelope returned by every endpoint. */
export interface KmbEnvelope<T> {
  type: string;
  version: string;
  generated_timestamp: string;
  data: T;
}

/** Direction as the API spells it in path segments. */
export type Direction = 'inbound' | 'outbound';

/** Direction as it appears inside route / route-stop payloads ("I" | "O"). */
export type Bound = 'I' | 'O';

/** A single route variant. GET /route/ returns an array of these. */
export interface KmbRoute {
  co?: string;
  route: string;
  /** "I" (inbound) or "O" (outbound). */
  bound: Bound;
  /** "1", "2", ... — distinguishes special / variant trips on the same route number. */
  service_type: string;
  orig_en: string | null;
  orig_tc: string | null;
  orig_sc: string | null;
  dest_en: string | null;
  dest_tc: string | null;
  dest_sc: string | null;
  data_timestamp?: string;
}

/** A physical bus stop. GET /stop and GET /stop/{id} use this shape. */
export interface KmbStop {
  stop: string;
  name_en: string | null;
  name_tc: string | null;
  name_sc: string | null;
  /** Latitude / longitude come back as strings; parse before use. */
  lat: string | null;
  long: string | null;
  data_timestamp?: string;
}

/** One entry in a route's ordered stop sequence. GET /route-stop/{route}/{dir}/{type}. */
export interface KmbRouteStop {
  co?: string;
  route: string;
  bound: Bound;
  service_type: string;
  /** Sequence position along the route, as a string ("1", "2", ...). */
  seq: string;
  /** The stop id, joinable against KmbStop.stop. */
  stop: string;
  data_timestamp?: string;
}

/** A single estimated-time-of-arrival prediction. */
export interface KmbEta {
  co?: string;
  route: string;
  /** "I" | "O". */
  dir: Bound;
  service_type: number;
  seq: number;
  stop?: string;
  dest_tc: string | null;
  dest_en: string | null;
  dest_sc: string | null;
  /** 1..3 — ordering of predictions for this stop/route. */
  eta_seq: number | null;
  /** ISO 8601 with +08:00 offset, or null when no estimate is available. */
  eta: string | null;
  rmk_tc: string | null;
  rmk_en: string | null;
  rmk_sc: string | null;
  data_timestamp?: string;
}
