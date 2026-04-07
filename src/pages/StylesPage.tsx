import { OverflowBreadcrumbs, PageHeader, SectionHeader, StatusIndicator } from '@diligentcorp/atlas-react-bundle';
import { Badge, Box, Button, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router';

import PageLayout from '../components/PageLayout.js';

function Label({ children }: { children: string }) {
  return <Chip label={children} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', height: 20, alignSelf: 'center' }} />;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ minWidth: 180 }}>
        <Label>{label}</Label>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

export default function StylesPage() {
  return (
    <PageLayout>
      <PageHeader
        pageTitle="Styles"
        pageSubtitle="Typography, lists, and text styles available in the design system"
        breadcrumbs={
          <OverflowBreadcrumbs
            leadingElement={<span>Connected Compliance</span>}
            items={[{ id: 'styles', label: 'Styles', url: '/styles' }]}
            hideLastItem
            aria-label="Breadcrumbs"
          >
            {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
          </OverflowBreadcrumbs>
        }
      />

      {/* Headings */}
      <SectionHeader title="Headings" />
      <Stack gap={3}>
        <Row label='variant="h1"'>
          <Typography variant="h1">Heading 1</Typography>
        </Row>
        <Row label='variant="h2"'>
          <Typography variant="h2">Heading 2</Typography>
        </Row>
        <Row label='variant="h3"'>
          <Typography variant="h3">Heading 3</Typography>
        </Row>
        <Row label='variant="h4"'>
          <Typography variant="h4">Heading 4</Typography>
        </Row>
        <Row label='variant="h5"'>
          <Typography variant="h5">Heading 5</Typography>
        </Row>
        <Row label='variant="h6"'>
          <Typography variant="h6">Heading 6</Typography>
        </Row>
      </Stack>

      <Divider />

      {/* Body & inline */}
      <SectionHeader title="Body and inline" />
      <Stack gap={3}>
        <Row label='variant="body1"'>
          <Typography variant="body1">Body 1 — the standard paragraph style. Use this for most text content in the UI.</Typography>
        </Row>
        <Row label='variant="textMd"'>
          <Typography variant="textMd">Text MD — medium-sized text style.</Typography>
        </Row>
        <Row label='variant="textSm"'>
          <Typography variant="textSm">Text SM — small text style.</Typography>
        </Row>
        <Row label='variant="labelLg"'>
          <Typography variant="labelLg">Label large</Typography>
        </Row>
        <Row label='variant="labelSm"'>
          <Typography variant="labelSm">Label small</Typography>
        </Row>
        <Row label='variant="labelXs"'>
          <Typography variant="labelXs">Label extra small</Typography>
        </Row>
        <Row label='variant="caption"'>
          <Typography variant="caption">Caption — supplementary or fine-print content.</Typography>
        </Row>
        <Row label='variant="overline"'>
          <Typography variant="overline">Overline text</Typography>
        </Row>
      </Stack>

      <Divider />

      {/* SectionHeader */}
      <SectionHeader title="Section headers" />
      <Stack gap={3}>
        <Row label="<SectionHeader />">
          <SectionHeader title="Section header (default)" />
        </Row>
        <Row label='headingLevel="h2"'>
          <SectionHeader title="Section header — h2" headingLevel="h2" />
        </Row>
        <Row label='headingLevel="h3"'>
          <SectionHeader title="Section header — h3" headingLevel="h3" />
        </Row>
        <Row label="with subtitle">
          <SectionHeader title="Section header" subtitle="With an optional subtitle beneath the title" />
        </Row>
      </Stack>

      <Divider />

      {/* Lists */}
      <SectionHeader title="Lists" />
      <Stack gap={3}>
        <Row label="disc list">
          <List dense disablePadding sx={{ pl: 2 }}>
            {['First item', 'Second item', 'Third item'].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Row>
        <Row label="decimal list">
          <List dense disablePadding sx={{ pl: 2 }}>
            {['First item', 'Second item', 'Third item'].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'decimal', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Row>
        <Row label="with secondary text">
          <List dense disablePadding sx={{ pl: 2 }}>
            {[
              { primary: 'Item with detail', secondary: 'This is the secondary line of text below the primary.' },
              { primary: 'Another item', secondary: 'More supporting detail here.' },
            ].map((item) => (
              <ListItem key={item.primary} divider={false} alignItems="flex-start" sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.primary}
                    </Typography>
                  }
                  secondary={item.secondary}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            ))}
          </List>
        </Row>
      </Stack>

      <Divider />

      {/* Pills & Badges */}
      <SectionHeader title="Pills & Badges" />
      <Stack gap={3}>

        {/* StatusIndicator colors */}
        <Row label="StatusIndicator">
          <Stack direction="row" gap={1} flexWrap="wrap">
            <StatusIndicator label="Warning" color="warning" />
            <StatusIndicator label="Success" color="success" />
            <StatusIndicator label="Error" color="error" />
            <StatusIndicator label="Information" color="information" />
            <StatusIndicator label="Disabled" color="disabled" />
            <StatusIndicator label="Generic" color="generic" />
            <StatusIndicator label="Subtle" color="subtle" />
          </Stack>
        </Row>

        {/* StatusIndicator with shadow */}
        <Row label='hasShadow'>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <StatusIndicator label="Warning" color="warning" hasShadow />
            <StatusIndicator label="Success" color="success" hasShadow />
            <StatusIndicator label="Error" color="error" hasShadow />
            <StatusIndicator label="Information" color="information" hasShadow />
          </Stack>
        </Row>

        {/* Chip sizes */}
        <Row label='Chip sizes'>
          <Stack direction="row" gap={1} alignItems="center">
            <Chip label="Small" size="small" />
            <Chip label="Large" size="large" />
          </Stack>
        </Row>

        {/* Chip variants */}
        <Row label='Chip variants'>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip label="Default" />
            <Chip label="Outlined" variant="outlined" />
            <Chip label="Shape" variant="shape" />
          </Stack>
        </Row>

        {/* Chip — clickable */}
        <Row label='Chip clickable'>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip label="Clickable" onClick={() => {}} />
            <Chip label="Deletable" onDelete={() => {}} />
            <Chip label="Both" onClick={() => {}} onDelete={() => {}} />
          </Stack>
        </Row>

        {/* MUI Badge */}
        <Row label='Badge'>
          <Stack direction="row" gap={3} alignItems="center">
            <Badge badgeContent={4} color="primary">
              <Chip label="Primary" />
            </Badge>
            <Badge badgeContent={12} color="error">
              <Chip label="Error" />
            </Badge>
            <Badge variant="dot" color="success">
              <Chip label="Dot" />
            </Badge>
          </Stack>
        </Row>

      </Stack>

      <Divider />

      {/* Buttons */}
      <SectionHeader title="Buttons" />
      <Stack gap={3}>
        <Row label='variant="contained"'>
          <Stack direction="row" gap={1} alignItems="center">
            <Button variant="contained" size="small">Small</Button>
            <Button variant="contained">Medium</Button>
            <Button variant="contained" size="large">Large</Button>
            <Button variant="contained" disabled>Disabled</Button>
          </Stack>
        </Row>
        <Row label='variant="outlined"'>
          <Stack direction="row" gap={1} alignItems="center">
            <Button variant="outlined" size="small">Small</Button>
            <Button variant="outlined">Medium</Button>
            <Button variant="outlined" size="large">Large</Button>
            <Button variant="outlined" disabled>Disabled</Button>
          </Stack>
        </Row>
        <Row label='variant="text"'>
          <Stack direction="row" gap={1} alignItems="center">
            <Button variant="text" size="small">Small</Button>
            <Button variant="text">Medium</Button>
            <Button variant="text" size="large">Large</Button>
            <Button variant="text" disabled>Disabled</Button>
          </Stack>
        </Row>
        <Row label='error (via sx)'>
          <Stack direction="row" gap={1} alignItems="center">
            <Button variant="contained" sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}>Contained</Button>
            <Button variant="outlined" sx={{ color: 'error.main', borderColor: 'error.main', '&:hover': { borderColor: 'error.dark', bgcolor: 'error.50' } }}>Outlined</Button>
            <Button variant="text" sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.50' } }}>Text</Button>
          </Stack>
        </Row>
        <Row label='color="ai"'>
          <Stack direction="row" gap={1} alignItems="center">
            <Button variant="contained" color="ai" size="small">Small</Button>
            <Button variant="contained" color="ai">Medium</Button>
            <Button variant="contained" color="ai" size="large">Large</Button>
            <Button variant="contained" color="ai" disabled>Disabled</Button>
          </Stack>
        </Row>
      </Stack>
    </PageLayout>
  );
}
