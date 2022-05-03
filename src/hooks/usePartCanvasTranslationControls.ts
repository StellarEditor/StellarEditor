import { ThreeEvent } from '@react-three/fiber';
import { PartWithTransformations } from 'game/parts/PartWithTransformations';
import {
  getPart,
  mutateBlueprintWithoutHistory,
  mutateParts,
} from 'interfaces/blueprint';
import { selectPartOnly } from 'interfaces/selection';
import blueprintStore from 'stores/blueprint';
import { Vector2 } from 'three';
import { UUID } from 'types/Parts';
import snap from 'utilities/snap';
import useMousePos from './useMousePos';

/**
 * @deprecated
 */
const usePartCanvasTranslationControls = <Type extends PartWithTransformations>(
  ID: UUID,
) => {
  const getMousePos = useMousePos();

  let selectedInitially = false;
  let initialMousePos: Vector2;
  let deltaX = 0;
  let deltaY = 0;

  const onPointerUp = () => {
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointermove', onPointerMove);

    if (deltaX > 0 || deltaY > 0) {
      // revert to original offset
      mutateBlueprintWithoutHistory((draft) => {
        mutateParts<Type>(
          draft.selections,
          (state) => {
            state.p.x -= deltaX;
            state.p.y -= deltaY;
          },
          draft,
        );
      });

      // apply them again with history
      mutateParts<Type>(blueprintStore.getState().selections, (state) => {
        state.p.x += deltaX;
        state.p.y += deltaY;
      });
    }
  };
  const onPointerMove = () => {
    const mousePos = getMousePos();
    const newDeltaX = snap(mousePos.x - initialMousePos.x, 1);
    const newDeltaY = snap(mousePos.y - initialMousePos.y, 1);

    if (!selectedInitially) {
      selectPartOnly(ID);
      selectedInitially = true;
    }

    if (newDeltaX !== deltaX || newDeltaY !== deltaY) {
      mutateBlueprintWithoutHistory((draft) => {
        // mutateParts<Type>(
        //   draft.selections,
        //   (state) => {
        //     state.p.x += newDeltaX - deltaX;
        //     state.p.y += newDeltaY - deltaY;
        //   },
        //   draft,
        // );
        draft.selections.forEach((selection) => {
          const part = getPart<PartWithTransformations>(selection);

          if (part) {
            part.p.x += newDeltaX - deltaX;
            part.p.y += newDeltaY - deltaY;
          }
        });
      });
    }

    deltaX = newDeltaX;
    deltaY = newDeltaY;
  };
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    const part = getPart(ID) as Type | undefined;

    if (part) {
      event.stopPropagation();

      initialMousePos = getMousePos();
      deltaX = 0;
      deltaY = 0;

      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMove);

      selectedInitially = part.selected;
    }
  };

  return handlePointerDown;
};
export default usePartCanvasTranslationControls;
