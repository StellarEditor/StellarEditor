import * as ContextMenu from 'components/ContextMenu';
import * as ControlMenu from 'components/ControlMenu';
import * as Tabs from 'components/Tabs';
import useFile from 'hooks/useFile';
import useStellarContext from 'hooks/useStellarContext';
import produce from 'immer';
import { newBlueprint } from 'interfaces/blueprint';
import { random } from 'lodash';
import { FC, RefObject, useRef } from 'react';
import appStore from 'stores/app';
import settingsStore, { SettingsStore } from 'stores/settings';
import styles from './index.module.scss';

const ToolBarTop: FC = () => {
  const draft = useFile();
  const stellarContext = useStellarContext();
  const openInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = (ref: RefObject<HTMLInputElement>) => {
    if (ref.current?.files) {
      const fileReader = new FileReader();
      const file = ref.current.files[0];

      fileReader.readAsText(file);

      fileReader.onload = () => {
        if (typeof fileReader.result == 'string')
          newBlueprint(JSON.parse(fileReader.result));
      };
    }
  };

  return (
    <div className={styles['toolbar-top']}>
      <input
        className={styles['file-input']}
        accept=".stbp"
        ref={openInputRef}
        type="file"
        onChange={() => handleInputClick(openInputRef)}
      />
      <input
        className={styles['file-input']}
        accept=".json, .txt"
        ref={importInputRef}
        type="file"
        onChange={() => handleInputClick(importInputRef)}
      />

      <ControlMenu.Container>
        <ControlMenu.Button
          extension={
            <ContextMenu.Container>
              {/* Pro tip: add "..." only if further interaction is required */}
              <ContextMenu.Button onClick={() => newBlueprint()}>
                New
              </ContextMenu.Button>
              <ContextMenu.Button onClick={() => openInputRef.current?.click()}>
                Open...
              </ContextMenu.Button>

              <ContextMenu.Separator />

              <ContextMenu.Button onClick={draft.save}>Save</ContextMenu.Button>
              <ContextMenu.Button
                onClick={() => importInputRef.current?.click()}
              >
                Import...
              </ContextMenu.Button>
              <ContextMenu.Button disabled>Export...</ContextMenu.Button>
            </ContextMenu.Container>
          }
        >
          File
        </ControlMenu.Button>
        <ControlMenu.Button
          extension={
            <ContextMenu.Container>
              <ContextMenu.Button disabled>Undo</ContextMenu.Button>
              <ContextMenu.Button disabled>Redo</ContextMenu.Button>

              <ContextMenu.Separator />

              <ContextMenu.Button disabled>Cut</ContextMenu.Button>
              <ContextMenu.Button disabled>Copy</ContextMenu.Button>
              <ContextMenu.Button disabled>Paste</ContextMenu.Button>
              <ContextMenu.Button disabled>Delete</ContextMenu.Button>

              <ContextMenu.Separator />

              <ContextMenu.Button disabled>Hide</ContextMenu.Button>
              <ContextMenu.Button disabled>Unhide</ContextMenu.Button>
              <ContextMenu.Button disabled>Lock</ContextMenu.Button>
              <ContextMenu.Button disabled>Unlock</ContextMenu.Button>
            </ContextMenu.Container>
          }
        >
          Edit
        </ControlMenu.Button>
        <ControlMenu.Button
          extension={
            <ContextMenu.Container>
              <ContextMenu.Button disabled>Layout</ContextMenu.Button>
              <ContextMenu.Button disabled>Staging</ContextMenu.Button>
              <ContextMenu.Button disabled>Simulation</ContextMenu.Button>
              <ContextMenu.Button disabled>Rendering</ContextMenu.Button>

              <ContextMenu.Separator />

              <ContextMenu.Button disabled>Toggle HUD</ContextMenu.Button>
              <ContextMenu.Extension
                disabled
                extension={
                  <ContextMenu.Container>
                    <ContextMenu.Button disabled>
                      Stellar Dark (Default)
                    </ContextMenu.Button>
                    <ContextMenu.Button disabled>
                      Stellar Light
                    </ContextMenu.Button>
                  </ContextMenu.Container>
                }
              >
                Theme
              </ContextMenu.Extension>
            </ContextMenu.Container>
          }
        >
          View
        </ControlMenu.Button>
        <ControlMenu.Button
          extension={
            <ContextMenu.Container>
              <ContextMenu.Extension
                disabled
                extension={
                  <ContextMenu.Container>
                    <ContextMenu.Button>Fuel Tank</ContextMenu.Button>
                    <ContextMenu.Button>Structural Part</ContextMenu.Button>
                  </ContextMenu.Container>
                }
              >
                Structural
              </ContextMenu.Extension>
              <ContextMenu.Extension
                disabled
                extension={
                  <ContextMenu.Container>
                    <ContextMenu.Button>Titan</ContextMenu.Button>
                    <ContextMenu.Button>Hawk</ContextMenu.Button>
                    <ContextMenu.Button>Frontier</ContextMenu.Button>
                    <ContextMenu.Button>Valiant</ContextMenu.Button>
                    <ContextMenu.Button>Ion</ContextMenu.Button>
                    <ContextMenu.Button>RCS Thruster</ContextMenu.Button>
                  </ContextMenu.Container>
                }
              >
                Propulsion
              </ContextMenu.Extension>
              <ContextMenu.Extension
                disabled
                extension={
                  <ContextMenu.Container>
                    <ContextMenu.Button>Parachute</ContextMenu.Button>
                    <ContextMenu.Button>Side Parachute</ContextMenu.Button>
                    <ContextMenu.Button>Separator</ContextMenu.Button>
                    <ContextMenu.Button>Side Separator</ContextMenu.Button>
                    <ContextMenu.Button>Side Landing Leg</ContextMenu.Button>
                    <ContextMenu.Button>Landing Legs</ContextMenu.Button>
                    <ContextMenu.Button>Large Landing Legs</ContextMenu.Button>
                    <ContextMenu.Button>Wheel</ContextMenu.Button>
                    <ContextMenu.Button>Large Wheel</ContextMenu.Button>
                    <ContextMenu.Button>Solar Panel</ContextMenu.Button>
                    <ContextMenu.Button>Large Solar Panel</ContextMenu.Button>
                    <ContextMenu.Button>Docking Port</ContextMenu.Button>
                  </ContextMenu.Container>
                }
              >
                Electric
              </ContextMenu.Extension>
              <ContextMenu.Extension
                disabled
                extension={
                  <ContextMenu.Container>
                    <ContextMenu.Button>Nose Cone</ContextMenu.Button>
                    <ContextMenu.Button>Side Nose Cone</ContextMenu.Button>
                    <ContextMenu.Button>Fuselage</ContextMenu.Button>
                  </ContextMenu.Container>
                }
              >
                Aerodynamic
              </ContextMenu.Extension>
            </ContextMenu.Container>
          }
        >
          Part
        </ControlMenu.Button>
        <ControlMenu.Button
          extension={
            <ContextMenu.Container>
              <ContextMenu.Button to="https://discord.gg/nDt7AjGJQH/">
                Discord
              </ContextMenu.Button>
              {
                // wonderful grown-up easter egg
                random(0, 999, false) === 0 ? (
                  <ContextMenu.Button disabled>
                    "You'll make a wonderful grown-up!"
                  </ContextMenu.Button>
                ) : undefined
              }
            </ContextMenu.Container>
          }
        >
          Help
        </ControlMenu.Button>
        {stellarContext.codeName === 'dev' ||
        stellarContext.codeName === 'alpha' ? (
          <ControlMenu.Button
            extension={
              <ContextMenu.Container>
                <ContextMenu.Toggle
                  defaultState={
                    settingsStore.getState().debug.load_dummy_on_Launch
                  }
                  onClick={() => {
                    settingsStore.setState(
                      produce((draft: SettingsStore) => {
                        draft.debug.load_dummy_on_Launch =
                          !draft.debug.load_dummy_on_Launch;
                      }),
                    );
                  }}
                >
                  Load dummy BP on launch
                </ContextMenu.Toggle>
              </ContextMenu.Container>
            }
          >
            Debug
          </ControlMenu.Button>
        ) : undefined}
      </ControlMenu.Container>

      <Tabs.Container className={styles['toolbar-tabs']}>
        <Tabs.Tab
          onClick={() => appStore.setState({ tab: 'layout' })}
          selected={appStore((state) => state.tab) === 'layout'}
        >
          Layout
        </Tabs.Tab>
        <Tabs.Tab
          onClick={() => appStore.setState({ tab: 'staging' })}
          selected={appStore((state) => state.tab) === 'staging'}
        >
          Staging
        </Tabs.Tab>
        <Tabs.Tab
          onClick={() => appStore.setState({ tab: 'simulation' })}
          selected={appStore((state) => state.tab) === 'simulation'}
        >
          Simulation
        </Tabs.Tab>
        <Tabs.Tab
          onClick={() => appStore.setState({ tab: 'rendering' })}
          selected={appStore((state) => state.tab) === 'rendering'}
        >
          Rendering
        </Tabs.Tab>
      </Tabs.Container>
    </div>
  );
};
export default ToolBarTop;
