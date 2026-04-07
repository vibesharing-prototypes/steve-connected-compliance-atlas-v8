import { RoutedNavLink } from '@diligentcorp/atlas-react-bundle/global-nav';
import ComplianceEthicsIcon from '@diligentcorp/atlas-react-bundle/icons/ComplianceEthics';
import HomeIcon from '@diligentcorp/atlas-react-bundle/icons/Home';
import ReportsIcon from '@diligentcorp/atlas-react-bundle/icons/Reports';
import SettingsIcon from '@diligentcorp/atlas-react-bundle/icons/Settings';
import EditNoteIcon from '@diligentcorp/atlas-react-bundle/icons/EditNote';
import AssetInventoryIcon from '@diligentcorp/atlas-react-bundle/icons/AssetInventory';
import ComplianceEducationIcon from '@diligentcorp/atlas-react-bundle/icons/ComplianceEducation';
import TextIcon from '@diligentcorp/atlas-react-bundle/icons/Text';

export default function Navigation() {
  return (
    <>
      <RoutedNavLink to="/" label="D1P">
        <HomeIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/connected-compliance" label="Connected Compliance">
        <ComplianceEthicsIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/reports" label="Reports">
        <ReportsIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/training-plan" label="Training Plan">
        <ComplianceEducationIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/reference-assets" label="Reference Assets">
        <AssetInventoryIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/release-notes" label="Release notes">
        <EditNoteIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/settings" label="Settings">
        <SettingsIcon slot="icon" />
      </RoutedNavLink>
      <RoutedNavLink to="/styles" label="Styles">
        <TextIcon slot="icon" />
      </RoutedNavLink>
    </>
  );
}
