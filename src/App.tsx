import { AppLayout } from '@diligentcorp/atlas-react-bundle';
import KeyboardIcon from '@diligentcorp/atlas-react-bundle/icons/Keyboard';
import QuestionIcon from '@diligentcorp/atlas-react-bundle/icons/Question';
import ProfileIcon from '@diligentcorp/atlas-react-bundle/icons/Profile';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { NavLink, Outlet, Route, Routes, useNavigate } from 'react-router';
import './styles.css';

import ComplianceReportsPage from './pages/ComplianceReportsPage.js';
import IndexPage from './pages/IndexPage.js';
import ReportEditPage from './pages/ReportEditPage.js';
import ReportSharePage from './pages/ReportSharePage.js';
import ReferenceAssetsPage from './pages/ReferenceAssetsPage.js';
import TrainingPlanPage from './pages/TrainingPlanPage.js';
import ReleaseNotesPage from './pages/ReleaseNotesPage.js';
import ReportsPage from './pages/ReportsPage.js';
import SettingsPage from './pages/SettingsPage.js';
import StylesPage from './pages/StylesPage.js';


// Diligent "D" mark — red icon
function DiligentMark() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.4731 10.9859C19.4731 14.3014 18.2913 17.033 16.271 18.9211C16.2477 18.9416 16.2303 18.9631 16.207 18.9836C14.7044 20.3631 12.7452 21.2798 10.4641 21.6303L10.3099 21.4722L13.7098 1.77565L13.8377 1.41541C17.318 3.1278 19.4731 6.54577 19.4731 10.9859Z" fill="#EE312E" />
      <path d="M13.8387 1.41641L0 11.7474V21.439V21.7924H8.33328C9.07102 21.7924 9.78162 21.7358 10.4651 21.6303L13.8387 1.41641Z" fill="#D3222A" />
      <path d="M13.8387 1.4164L13.7427 1.55991L0.0717383 11.8148L0 11.7474C0 11.7474 0 11.7445 0 11.7416V0.207764H8.30129C8.87423 0.207764 9.42971 0.240957 9.96775 0.306368H9.98811C11.3473 0.468431 12.5988 0.824774 13.7185 1.3588C13.7631 1.38028 13.8387 1.4164 13.8387 1.4164Z" fill="#AF292E" />
    </svg>
  );
}

// "Diligent" wordmark
function DiligentWordmark() {
  return (
    <svg width="54" height="22" viewBox="0 0 54 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2872 8.17551H11.4661V16.4466H13.2872V8.17551Z" fill="currentColor" />
      <path d="M13.2872 5.07777H11.4661V7.13773H13.2872V5.07777Z" fill="currentColor" />
      <path d="M16.8399 4.8952H15.0189V16.4476H16.8399V4.8952Z" fill="currentColor" />
      <path d="M20.6911 8.17551H18.8701V16.4466H20.6911V8.17551Z" fill="currentColor" />
      <path d="M20.6911 5.07777H18.8701V7.13773H20.6911V5.07777Z" fill="currentColor" />
      <path d="M28.5579 9.17425C28.2973 8.84817 27.991 8.58653 27.64 8.38932C27.1675 8.12475 26.6221 7.99295 26.0056 7.99295C25.2589 7.99295 24.5919 8.16868 24.0056 8.51917C23.4184 8.87063 22.9536 9.35096 22.6095 9.96113C22.2662 10.5713 22.0941 11.2684 22.0941 12.0523C22.0941 12.8255 22.2653 13.5226 22.6095 14.1435C22.9527 14.7635 23.4233 15.2526 24.0202 15.608C24.6172 15.9643 25.2891 16.142 26.0358 16.142C26.6425 16.142 27.1879 16.0102 27.6702 15.7446C27.9784 15.5757 28.2438 15.357 28.4684 15.0886V16.0492C28.4684 16.4759 28.376 16.8429 28.1923 17.1475C28.0085 17.4531 27.7567 17.6845 27.4388 17.8417C27.1199 17.9989 26.7523 18.0779 26.3343 18.0779C25.8063 18.0779 25.361 17.9559 24.9983 17.7118C24.6347 17.4678 24.3887 17.1524 24.2594 16.7658L22.5725 17.4375C22.7417 17.9159 23.01 18.3308 23.3785 18.6813C23.7461 19.0328 24.1845 19.3071 24.6921 19.5053C25.1996 19.7035 25.7519 19.803 26.3488 19.803C27.115 19.803 27.7946 19.64 28.3867 19.3149C28.9789 18.9888 29.4436 18.5446 29.7829 17.9793C30.1213 17.4141 30.2905 16.7707 30.2905 16.0492V8.17551H28.5588L28.5579 9.17425ZM28.1855 13.2737C27.9959 13.63 27.7353 13.9092 27.4018 14.1133C27.0683 14.3163 26.6872 14.4188 26.2594 14.4188C25.8209 14.4188 25.431 14.3144 25.0878 14.1055C24.7446 13.8975 24.4762 13.6173 24.2818 13.2659C24.0873 12.9144 23.9911 12.5161 23.9911 12.068C23.9911 11.6198 24.0883 11.2186 24.2818 10.8622C24.4762 10.5059 24.7446 10.2238 25.0878 10.0148C25.431 9.80688 25.8219 9.70144 26.2594 9.70144C26.6775 9.70144 27.0528 9.80591 27.3863 10.0148C27.7198 10.2238 27.9832 10.5059 28.1777 10.8622C28.3722 11.2186 28.4684 11.6198 28.4684 12.068C28.4684 12.5151 28.3741 12.9173 28.1855 13.2737Z" fill="currentColor" />
      <path d="M38.2836 9.18303C37.9501 8.80619 37.5417 8.51428 37.0595 8.30535C36.5763 8.0974 36.0269 7.99197 35.4095 7.99197C34.6531 7.99197 33.9715 8.17746 33.3638 8.54845C32.7571 8.92041 32.2768 9.42905 31.9229 10.0744C31.57 10.7207 31.393 11.4558 31.393 12.2798C31.393 13.094 31.5671 13.8292 31.9151 14.4852C32.2632 15.1413 32.7513 15.6626 33.3784 16.0492C34.0056 16.4358 34.727 16.6291 35.5427 16.6291C36.0998 16.6291 36.6103 16.5423 37.0731 16.3695C37.5359 16.1967 37.9365 15.9555 38.2748 15.6451C38.6132 15.3346 38.8621 14.9861 39.0215 14.5995L37.5291 13.8516C37.3395 14.1875 37.0809 14.4598 36.7532 14.6678C36.4246 14.8767 36.0269 14.9812 35.5593 14.9812C35.1013 14.9812 34.693 14.8718 34.3352 14.6532C33.9764 14.4345 33.7032 14.1221 33.5145 13.7149C33.393 13.4523 33.3191 13.1624 33.2919 12.8451H39.217C39.2568 12.723 39.2821 12.5883 39.2918 12.4409C39.3016 12.2935 39.3064 12.1539 39.3064 12.0211C39.3064 11.4714 39.2189 10.955 39.0449 10.4717C38.8708 9.98944 38.6171 9.55988 38.2836 9.18303ZM33.499 10.8086C33.6779 10.3966 33.9346 10.0812 34.2681 9.86252C34.6016 9.64384 34.9817 9.53449 35.4105 9.53449C35.848 9.53449 36.2262 9.64676 36.5451 9.87033C36.8641 10.0939 37.0974 10.3946 37.2471 10.7705C37.3239 10.9657 37.3677 11.1737 37.3784 11.3963H33.3298C33.3658 11.1844 33.4212 10.9882 33.499 10.8086Z" fill="currentColor" />
      <path d="M46.3146 8.38932C45.8518 8.12475 45.3219 7.99295 44.7249 7.99295C44.1474 7.99295 43.6428 8.12572 43.2101 8.38932C42.8854 8.5875 42.6287 8.85501 42.4411 9.19182V8.17551H40.7094V16.4466H42.5305V11.5779C42.5305 11.1912 42.6025 10.8583 42.7473 10.5781C42.8912 10.298 43.0954 10.0822 43.3599 9.92989C43.6233 9.77759 43.9248 9.70047 44.2631 9.70047C44.5917 9.70047 44.8854 9.77662 45.144 9.92989C45.4026 10.0822 45.6039 10.2989 45.7488 10.5781C45.8927 10.8583 45.9656 11.1912 45.9656 11.5779V16.4466H47.7867V11.1053C47.7867 10.4952 47.6573 9.95625 47.3987 9.48764C47.1381 9.02097 46.7784 8.65389 46.3146 8.38932Z" fill="currentColor" />
      <path d="M53.6894 14.8757C53.5951 14.8855 53.5075 14.8914 53.4278 14.8914C53.1196 14.8914 52.8629 14.8406 52.6588 14.7391C52.4546 14.6375 52.3058 14.4901 52.2105 14.2968C52.1162 14.1035 52.0686 13.8643 52.0686 13.5792V9.84007H53.9198V8.17551H52.0695V6.28348H50.2485V6.92392C50.2485 7.32029 50.1415 7.62879 49.9276 7.84748C49.7137 8.06617 49.4123 8.17551 49.0244 8.17551H48.8455V9.8391H50.2485V13.6691C50.2485 14.5848 50.4925 15.2916 50.9796 15.7905C51.4667 16.2894 52.1541 16.5383 53.0399 16.5383C53.1789 16.5383 53.3355 16.5286 53.5105 16.5081C53.6845 16.4876 53.8362 16.4671 53.9655 16.4466V14.8445C53.876 14.8552 53.7837 14.866 53.6894 14.8757Z" fill="currentColor" />
      <path d="M7.1152 5.79533C6.2547 5.31696 5.2416 5.07874 4.0778 5.07874H0V16.4485H4.0778C5.2426 16.4485 6.2547 16.2064 7.1152 15.7232C7.9757 15.2399 8.6426 14.5711 9.1152 13.7159C9.5877 12.8617 9.824 11.8746 9.824 10.7548C9.824 9.63603 9.5877 8.64901 9.1152 7.79379C8.6426 6.93954 7.9766 6.27371 7.1152 5.79533ZM7.4438 12.8539C7.1307 13.4494 6.6903 13.9092 6.1225 14.2353C5.5557 14.5614 4.8838 14.7234 4.107 14.7234H1.895V6.80286H4.107C4.8828 6.80286 5.5547 6.96297 6.1225 7.28319C6.6893 7.6034 7.1298 8.05932 7.4438 8.649C7.7569 9.23965 7.9144 9.93575 7.9144 10.7402C7.9144 11.5534 7.7579 12.2583 7.4438 12.8539Z" fill="currentColor" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/', label: 'D1P Home' },
  { to: '/connected-compliance', label: 'Connected Compliance' },
  { to: '/reports', label: 'Reports' },
  { to: '/training-plan', label: 'Training Plan' },
  { to: '/reference-assets', label: 'Reference Assets' },
  { to: '/release-notes', label: 'Release Notes' },
  { to: '/settings', label: 'Settings' },
  { to: '/styles', label: 'Styles' },
];

function BrandedHeader({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
      {/* Top brand bar */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, height: 48 }}
      >
        <Box
          component="button"
          onClick={onLogoClick}
          aria-label="Open navigation menu"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            border: 'none', bgcolor: 'transparent', cursor: 'pointer',
            p: 0.5, borderRadius: 0.5,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <DiligentMark />
          <Box sx={{ color: 'text.primary' }}>
            <DiligentWordmark />
          </Box>
        </Box>

        <Stack direction="row" alignItems="center">
          <IconButton size="small" aria-label="Keyboard shortcuts">
            <KeyboardIcon style={{ width: 20, height: 20 }} />
          </IconButton>
          <IconButton size="small" aria-label="Help">
            <QuestionIcon style={{ width: 20, height: 20 }} />
          </IconButton>
          <IconButton size="small" aria-label="Account">
            <ProfileIcon style={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
      </Stack>

    </Box>
  );
}

function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  function handleNav(to: string) {
    setDrawerOpen(false);
    navigate(to);
  }

  return (
    <AppLayout orgName="Connected Compliance">
      <BrandedHeader onLogoClick={() => setDrawerOpen(true)} />

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="labelSm" sx={{ px: 2, pb: 1, display: 'block', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
            Connected Compliance
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense disablePadding>
            {NAV_ITEMS.map(({ to, label }) => (
              <ListItem key={to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={to}
                  end={to === '/'}
                  onClick={() => handleNav(to)}
                  sx={{
                    px: 2, py: 1,
                    '&.active': {
                      bgcolor: 'action.selected',
                      '& .MuiListItemText-primary': { fontWeight: 700, color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<IndexPage />} />
        <Route path="connected-compliance" element={<ComplianceReportsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/q1-2026" element={<ReportEditPage />} />
        <Route path="reports/q1-2026/share" element={<ReportSharePage />} />
        <Route path="training-plan" element={<TrainingPlanPage />} />
        <Route path="reference-assets" element={<ReferenceAssetsPage />} />
        <Route path="release-notes" element={<ReleaseNotesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="styles" element={<StylesPage />} />
      </Route>
    </Routes>
  );
}
