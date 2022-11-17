import { DeferUpdatesEventDetail, getDeferUpdates } from './getDeferUpdates';

export const deferUpdates = () => {
  if (!getDeferUpdates()) {
    window.dispatchEvent(
      new CustomEvent<DeferUpdatesEventDetail>('deferupdates', {
        detail: true,
      }),
    );
  }
};
