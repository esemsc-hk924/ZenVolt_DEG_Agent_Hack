export type Trip = {
    tripId: string;
    distance_km: number;
    fuel_liters: number;
    idle_seconds: number;
    events: { overspeed: number; harsh_accel: number; harsh_brake: number; cornering: number };
    samples: { t: number; speed_kmh: number; rpm: number; throttle: number }[];
  };
  
  export type DriverDemo = { driverId: string; period: string; trips: Trip[] };
  
  export type DriverMetrics = {
    driverId: string;
    period: string;
    trips: number;
    distance_km: number;
    fuel_liters: number;
    idle_seconds: number;
    overspeed: number;
    harsh_accel: number;
    harsh_brake: number;
    cornering: number;
    idle_share_pct: number;
    l_per_100km: number;
    ecoScore: number;
    est_saving_pct: number;
  };
  
  export function computeMetrics(d: DriverDemo): DriverMetrics {
    const trips = d.trips.length;
    let distance = 0, fuel = 0, idle = 0;
    let os = 0, ha = 0, hb = 0, c = 0;
  
    for (const t of d.trips) {
      distance += t.distance_km;
      fuel += t.fuel_liters;
      idle += t.idle_seconds;
      os += t.events.overspeed;
      ha += t.events.harsh_accel;
      hb += t.events.harsh_brake;
      c  += t.events.cornering;
    }
  
    const lPer100 = distance > 0 ? (fuel / distance) * 100 : 0;
    const idleShare = Math.min(40, (idle / Math.max(1, distance * 72)) * 100);
  
    const penalty =
      os * 2.5 +
      ha * 2.0 +
      hb * 2.0 +
      c  * 1.5 +
      idleShare * 0.6 +
      Math.max(0, lPer100 - 7.0) * 2.0;
  
    const ecoScore = Math.max(0, Math.min(100, 100 - penalty));
    const estSaving = Math.max(2, Math.min(15, Math.round(((100 - ecoScore) / 12 + idleShare / 20) * 10) / 10));
  
    return {
      driverId: d.driverId,
      period: d.period,
      trips,
      distance_km: Math.round(distance * 10) / 10,
      fuel_liters: Math.round(fuel * 10) / 10,
      idle_seconds: idle,
      overspeed: os,
      harsh_accel: ha,
      harsh_brake: hb,
      cornering: c,
      idle_share_pct: Math.round(idleShare * 10) / 10,
      l_per_100km: Math.round(lPer100 * 10) / 10,
      ecoScore: Math.round(ecoScore),
      est_saving_pct: estSaving
    };
  }
  
  export function tripDerived(t: Trip) {
    const l_per_100km = t.distance_km > 0 ? (t.fuel_liters / t.distance_km) * 100 : 0;
    const idle_minutes = Math.round((t.idle_seconds / 60) * 10) / 10;
    const event_count = t.events.overspeed + t.events.harsh_accel + t.events.harsh_brake + t.events.cornering;
    return {
      tripId: t.tripId,
      l_per_100km: Math.round(l_per_100km * 10) / 10,
      idle_minutes,
      event_count,
      overspeed: t.events.overspeed,
      harsh_accel: t.events.harsh_accel,
      harsh_brake: t.events.harsh_brake,
      cornering: t.events.cornering
    };
  }
  