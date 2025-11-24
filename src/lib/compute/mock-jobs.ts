// src/lib/compute/mock-jobs.ts

/* ------------------------------------------------------------------
   Shared types for Compute dashboard
   (RegionMap, JobQueue, ComputePage, etc.)
------------------------------------------------------------------- */

export type ComputeJob = {
  id: string;
  type: "inference" | "training" | "batch";
  energyKwh: number;
  windowMins: number;
  deadlineMins: number;
  region: "london" | "scotland" | "cudos";
  status: "queued" | "running" | "deferred" | "shifted" | "done";
};

export type Region = {
  id: "london" | "scotland" | "cudos" | (string & {});
  name: string;

  // grid signals
  carbonIntensity: number;   // gCO2/kWh
  renewableShare: number;    // %
  energyPrice: number;       // £/kWh

  // compute capacity
  gpuCapacity: {
    available: number;
    total: number;
  };

  // optional UI helpers
  color?: string;
};

/* ------------------------------------------------------------------
   Optional seed data (fallbacks)
------------------------------------------------------------------- */

export const SEED_REGIONS: Region[] = [
  {
    id: "london",
    name: "London",
    carbonIntensity: 120,
    renewableShare: 35,
    energyPrice: 0.22,
    gpuCapacity: { available: 6, total: 24 },
    color: "#60A5FA",
  },
  {
    id: "scotland",
    name: "Scotland",
    carbonIntensity: 65,
    renewableShare: 78,
    energyPrice: 0.18,
    gpuCapacity: { available: 10, total: 16 },
    color: "#4ADE80",
  },
  {
    id: "cudos",
    name: "CUDOS",
    carbonIntensity: 90,
    renewableShare: 55,
    energyPrice: 0.2,
    gpuCapacity: { available: 4, total: 8 },
    color: "#FACC15",
  },
];

export const SEED_JOBS: ComputeJob[] = [
  {
    id: "J12",
    type: "inference",
    energyKwh: 3.2,
    windowMins: 20,
    deadlineMins: 30,
    region: "london",
    status: "queued",
  },
  {
    id: "J17",
    type: "training",
    energyKwh: 8.0,
    windowMins: 40,
    deadlineMins: 240,
    region: "london",
    status: "queued",
  },
  {
    id: "J19",
    type: "batch",
    energyKwh: 2.1,
    windowMins: 15,
    deadlineMins: 60,
    region: "scotland",
    status: "running",
  },
];
