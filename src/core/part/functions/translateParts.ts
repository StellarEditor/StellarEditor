import { mutateBlueprint } from 'core/blueprint';
import { Blueprint } from 'game/Blueprint';
import { PartWithTransformations } from 'game/parts/PartWithTransformations';
import { Vector2 } from 'three';
import { mutateParts } from './mutateParts';

export const translateParts = (
  ids: string[],
  vector: Vector2,
  state?: Blueprint,
) => {
  if (state) {
    mutateParts<PartWithTransformations>(
      ids,
      (draft) => {
        draft.p.x += vector.x;
        draft.p.y += vector.y;
      },
      state,
    );
  } else {
    mutateBlueprint((draft) => {
      translateParts(ids, vector, draft);
    });
  }
};
