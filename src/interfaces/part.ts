import {
  FuelTankData,
  FuelTankIcon,
  FuelTankLayoutComponent,
  FuelTankPropertyComponent,
  VanillaFuelTankData,
} from 'game/parts/FuelTank';
import { GroupData, GroupIcon, GroupLayoutComponent } from 'game/parts/Group';
import { Part, VanillaPart } from 'game/parts/Part';
import { cloneDeep, merge } from 'lodash';
import { FC } from 'react';
import {
  AnyPart,
  AnyVanillaPart,
  PartComponentProps,
  PartPropertyComponentProps,
  UUID,
} from 'types/Parts';

export const VanillaPartData = new Map<string, VanillaPart>([
  ['Fuel Tank', VanillaFuelTankData],
]);

export const PartData = new Map<string, Part>([
  ['Fuel Tank', FuelTankData],
  ['Group', GroupData],
]);

export const PartLayoutComponents = new Map<string, FC<PartComponentProps>>([
  ['Fuel Tank', FuelTankLayoutComponent],
  ['Group', GroupLayoutComponent],
]);

export const PartPropertyComponents = new Map<
  string,
  FC<PartPropertyComponentProps>
>([['Fuel Tank', FuelTankPropertyComponent]]);

export const PartIcons = new Map<string, FC>([
  ['Fuel Tank', FuelTankIcon],
  ['Group', GroupIcon],
]);

export const getVanillaPartData = (partName: string) =>
  VanillaPartData.get(partName);

export const getPartData = (partName: string) => PartData.get(partName);

export const getPartLayoutComponent = (partName: string) =>
  PartLayoutComponents.get(partName);

export const getPartPropertyComponent = (partName: string) =>
  PartPropertyComponents.get(partName);

export const getPartIcon = (partName: string) => PartIcons.get(partName);

export const importifyPart = (
  part: AnyVanillaPart | AnyPart,
  ID: UUID,
  parentID?: UUID,
) => {
  const clonedPart = cloneDeep(part);

  if (getPartData(clonedPart.n)) {
    const defaultPartData = cloneDeep(getPartData(clonedPart.n));

    const newPart = merge(defaultPartData, clonedPart, {
      ID,
      parentID,
    }) as AnyPart;

    return newPart;
  }
};
