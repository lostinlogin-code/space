export type Screen = 'Landing' | 'Dashboard' | 'HUDSimulator' | 'AICommand';

export interface TelemetryData {
  heartRate: number;
  oxygen: number; // percentage
  suitPressure: number; // psi
  internalTemp: number; // Celsius
  externalTemp: number; // Celsius
  battery: number; // percentage
  waterReserve: number; // percentage
  propellant: number; // percentage
  co2Scrub: number; // percentage
  radiation: number; // rad/hr
}

export interface SystemConfig {
  visorPolarization: 'MIRROR' | 'GOLD' | 'INFRARED' | 'THERMAL';
  recircRate: 'CONSERVATIVE' | 'NOMINAL' | 'MAXIMUM';
  thrusterDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  exoskeletonTorque: number; // 0 to 100
  nightVision: boolean;
  thermalFilter: boolean;
}

export interface DiagnosticItem {
  id: string;
  name: string;
  status: 'OK' | 'WARNING' | 'CRITICAL' | 'CALIBRATING';
  category: 'Life Support' | 'Power' | 'Propulsion' | 'Structural';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MetricItem {
  tag: string;
  value: string;
  label: string;
}
