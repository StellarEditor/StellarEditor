import { TransformIcon as Icon } from '@radix-ui/react-icons';
import PartCluster from 'components/Canvas/components/PartCluster';
import { mutateBounds } from 'core/app';
import { partExportify, removePartMetaData } from 'core/part';
import PartCategory from 'hooks/constants/partCategory';
import useDragControls from 'hooks/useDragControls';
import useSelectionControl from 'hooks/useSelectionControl';
import { isArray } from 'lodash';
import { FC, useCallback, useEffect, useRef } from 'react';
import useBounds, { BoundListing } from 'stores/useBounds';
import { PartExportifier, PartRegistryFragment } from 'stores/usePartRegistry';
import { Box3, Group as ThreeGroup } from 'three';
import { PartComponentProps } from 'types/Parts';
import { Part, PartData, VanillaPart } from './Part';

export interface Group extends Part {
  readonly n: 'Group';
  expanded: boolean;
  part_order: string[];
}

export const GroupData: Group = {
  ...PartData,

  n: 'Group',
  label: 'Group',
  expanded: false,
  part_order: [],
};

export const GroupLayoutComponent: FC<PartComponentProps> = ({ id }) => {
  const cluster = useRef<ThreeGroup>(null);
  const handleClick = useSelectionControl(id);
  const handlePointerDown = useDragControls(id);

  const computeBounds = useCallback(() => {
    if (cluster.current) {
      const box3 = new Box3().setFromObject(cluster.current);
      const boundListing: BoundListing = {
        bounds: {
          width: box3.max.x - box3.min.x,
          height: box3.max.y - box3.min.y,
            x: (box3.min.x + box3.max.x) / 2,
            y: (box3.min.y + box3.max.y) / 2,
          rotation: 0,
        },
        needsUpdate: false,
      };

      mutateBounds((draft) => {
        draft.parts.set(id, boundListing);
      });
    }
  }, [id]);

  useEffect(computeBounds);
  useEffect(() => {
    const unsubscribe = useBounds.subscribe(
      (state) => state.deferUpdates,
      (deferUpdates) => {
        const boundListing = useBounds.getState().parts.get(id);

        // is not deferred anymore, bound listing exists, and it needs to be updated
        if (!deferUpdates && boundListing && boundListing.needsUpdate) {
          computeBounds();
        }
      },
    );

    return unsubscribe;
  }, [computeBounds, id]);

  return (
    <PartCluster
      ref={cluster}
      parentId={id}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
    />
  );
};

export const GroupIcon = Icon;

export const groupExportify: PartExportifier<Group> = (part, draft) => {
  const exportedParts: VanillaPart[] = [];
  const partWithoutMetaData = removePartMetaData(part) as Group;

  partWithoutMetaData.part_order.forEach((id) => {
    const childPart = draft.parts.get(id);

    if (childPart) {
      const exportedPart = partExportify(childPart, draft);

      if (exportedPart) {
        if (isArray(exportedPart)) {
          exportedParts.push(...exportedPart);
        } else {
          exportedParts.push(exportedPart);
        }
      }
    }
  });

  return exportedParts;
};

export const GroupRegistry: PartRegistryFragment<Group> = [
  'Group',
  {
    category: PartCategory.Abstract,

    vanillaData: null,
    data: GroupData,

    Icon: GroupIcon,
    Mesh: GroupLayoutComponent,

    exportify: groupExportify,
  },
];
