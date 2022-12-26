import {
  Component1Icon,
  MagnifyingGlassIcon,
  MixerVerticalIcon,
} from '@radix-ui/react-icons';
import * as Sidebar from 'components/Sidebar';
import mutateSettings from 'core/app/mutateSettings';
import useTranslator from 'hooks/useTranslator';
import useSettings, { SidebarTab } from 'stores/settings';
import { TabLayoutProps } from '../../..';

export default function Tabs({ swapSecondTab }: TabLayoutProps) {
  const { t } = useTranslator();
  const rightSidebar = useSettings(
    (draft) => draft.interface.tabs.layout.rightSidebar,
  );
  const handleClick = (tab: SidebarTab) => () => {
    mutateSettings((draft) => {
      draft.interface.tabs.layout.rightSidebar.tab = tab;
    });
  };

  return (
    <Sidebar.TabContainer>
      <Sidebar.Tab
        onClick={handleClick(SidebarTab.Left)}
        selected={rightSidebar.tab === SidebarTab.Left}
        icon={swapSecondTab ? <Component1Icon /> : <MixerVerticalIcon />}
      >
        {swapSecondTab
          ? t`tabs.layout.left_sidebar.snippets`
          : t`tabs.layout.right_sidebar.properties`}
      </Sidebar.Tab>
      <Sidebar.Tab
        onClick={handleClick(SidebarTab.Right)}
        selected={rightSidebar.tab === SidebarTab.Right}
        icon={<MagnifyingGlassIcon />}
      >
        {t`tabs.layout.right_sidebar.inspect`}
      </Sidebar.Tab>
    </Sidebar.TabContainer>
  );
}
