import { Part, VanillaPart } from './parts/Part';

export interface VanillaStage {
  partIndexes: number[];
}

export interface VanillaBlueprint {
  center: number;
  offset: { x: number; y: number };
  parts: VanillaPart[];
  stages: VanillaStage[];
}

export interface Blueprint extends Omit<VanillaBlueprint, 'parts'> {
  readonly format_version: number;

  selections: string[];
  parts: Record<string, Part>;
  part_order: string[];
}

export const vanillaBlueprintData: VanillaBlueprint = {
  center: 0,
  offset: { x: 0, y: 0 },
  parts: [],
  stages: [],
};

// TODO: switch from Map to plain object

export const blueprintData: Blueprint = {
  ...vanillaBlueprintData,

  format_version: 6,

  selections: [],
  parts: {},
  part_order: [],
};
