import * as Prompt from 'components/Prompt';
import mutateSettings from 'core/app/mutateSettings';
import prompt from 'core/interface/prompt';
import generateId from 'core/part/generateId';
import importifyPart from 'core/part/importifyPart';
import { Blueprint, blueprintData, VanillaBlueprint } from 'game/Blueprint';
import usePopupConcurrency from 'hooks/usePopupConcurrency';
import useTranslator from 'hooks/useTranslator';
import { cloneDeep, isArray } from 'lodash';
import useSettings from 'stores/settings';
import { getContext } from 'utilities/getContext';

export const WATERMARK_KEY = 'Generated by Stellar';
export const WATERMARK_VALUE = `${window.location.origin}/`;

type AnyBlueprint = VanillaBlueprint | Blueprint;
type AnyBlueprintWithWatermark = AnyBlueprint &
  Record<typeof WATERMARK_KEY, string | undefined>;

export const importifyBlueprint = (
  importedBlueprint: AnyBlueprint,
  warnMissing = false,
) => {
  const { title } = getContext();
  const missingParts: string[] = [];
  const newBlueprint = cloneDeep(blueprintData);

  // STEP 1: Remove watermark
  delete (newBlueprint as AnyBlueprintWithWatermark)[WATERMARK_KEY];

  // STEP 2: Copy all properties
  newBlueprint.center = importedBlueprint.center;
  newBlueprint.offset = importedBlueprint.offset;
  newBlueprint.selections = (importedBlueprint as Blueprint).selections ?? [];
  newBlueprint.stages = importedBlueprint.stages;

  // STEP 3: Importify all parts
  if (isArray(importedBlueprint.parts)) {
    // vanilla blueprint
    (importedBlueprint as VanillaBlueprint).parts.forEach((vanillaPart) => {
      const id = generateId(newBlueprint.parts);
      const importifiedPart = importifyPart(vanillaPart, id);

      if (importifiedPart) {
        newBlueprint.parts[id] = importifiedPart;
        newBlueprint.part_order.push(id);
      } else if (warnMissing && !missingParts.includes(vanillaPart.n)) {
        missingParts.push(vanillaPart.n);
      }
    });
  } else {
    Object.keys(importedBlueprint.parts).forEach((id) => {
      const importifiedPart = importifyPart(
        (importedBlueprint as Blueprint).parts[id],
        id,
      );
      if (importifiedPart) newBlueprint.parts[id] = importifiedPart;
    });

    newBlueprint.part_order = (importedBlueprint as Blueprint).part_order;
  }

  missingParts.sort();

  if (
    useSettings.getState().interface.showMissingParts &&
    warnMissing &&
    missingParts.length > 0
  ) {
    prompt(({ dismiss }) => {
      const { t, f } = useTranslator();
      const handleNeverClick = () => {
        mutateSettings((draft) => {
          draft.interface.showMissingParts = false;
        });
        dismiss();
      };

      usePopupConcurrency();

      return (
        <Prompt.Root>
          <Prompt.Info>
            <Prompt.Title>
              {`${f`prompts.missing_parts.title`[0]}${missingParts.length}${
                f`prompts.missing_parts.title`[1]
              }`}
            </Prompt.Title>
            <Prompt.Description>
              {`${f`prompts.missing_parts.description`[0]} ${title} ${
                f`prompts.missing_parts.description`[1]
              }`}
              <ul>
                {missingParts.map((missingPart) => (
                  <li>{missingPart}</li>
                ))}
              </ul>
            </Prompt.Description>
          </Prompt.Info>

          <Prompt.Actions>
            <Prompt.Action onClick={handleNeverClick}>
              {t`prompts.missing_parts.actions.never`}
            </Prompt.Action>
            <Prompt.Action color="accent" onClick={dismiss}>
              {t`prompts.missing_parts.actions.proceed`}
            </Prompt.Action>
          </Prompt.Actions>
        </Prompt.Root>
      );
    });
  }

  return newBlueprint;
};
