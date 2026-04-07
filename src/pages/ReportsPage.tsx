import { OverflowBreadcrumbs, PageHeader, StatusIndicator } from '@diligentcorp/atlas-react-bundle';
import {
  Box,
  Button,
  Chip,
  Link as MuiLink,
  Container,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

const REPORT_TYPES = [
  'Quarterly E&C Compliance Report',
  'High level summary',
  'Policy Overview',
  'Speak Up Overview',
  'Training Overview',
];

const GENERATION_STEPS = [
  'Analysing Speak Up case trends…',
  'Cross-referencing training completion…',
  'Evaluating policy review status…',
  'Identifying cross-domain risk signals…',
  'Synthesising executive narrative…',
  'Finalising report…',
];

const REPORTS = [
  {
    title: 'Quarterly E&C Compliance Report - Q1 2026',
    scope: 'Speak Up · Policy Manager · Training',
    date: '2026-03-19',
    dateLabel: '19 March 2026',
    status: 'Deteriorating',
    statusColor: 'error' as const,
    type: 'Configured' as const,
    to: '/reports/q1-2026',
  },
  {
    title: 'Quarterly E&C Compliance Report - Q4 2025',
    scope: 'Speak Up · Policy Manager · Training',
    date: '2025-12-21',
    dateLabel: '21 December 2025',
    status: 'Stable',
    statusColor: 'success' as const,
    type: 'Standard' as const,
    to: null,
  },
  {
    title: 'Quarterly E&C Compliance Report - Q3 2025',
    scope: 'Speak Up · Policy Manager · Training',
    date: '2025-09-22',
    dateLabel: '22 September 2025',
    status: 'Stable',
    statusColor: 'success' as const,
    type: 'Standard' as const,
    to: null,
  },
  {
    title: 'Quarterly E&C Compliance Report - Q2 2025',
    scope: 'Speak Up · Policy Manager · Training',
    date: '2025-06-23',
    dateLabel: '23 June 2025',
    status: 'Improving',
    statusColor: 'information' as const,
    type: 'Standard' as const,
    to: null,
  },
  {
    title: 'Quarterly E&C Compliance Report - Q1 2025',
    scope: 'Speak Up · Policy Manager · Training',
    date: '2025-03-24',
    dateLabel: '24 March 2025',
    status: 'Stable',
    statusColor: 'success' as const,
    type: 'Standard' as const,
    to: null,
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [orderBy, setOrderBy] = useState<'title' | 'date' | 'status' | 'type'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleSort(col: typeof orderBy) {
    if (orderBy === col) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(col);
      setOrder('asc');
    }
    setPage(0);
  }

  const sortedRows = [...REPORTS].sort((a, b) => {
    const mult = order === 'asc' ? 1 : -1;
    return mult * a[orderBy].localeCompare(b[orderBy]);
  });

  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function openModal(presetStart?: Dayjs, presetEnd?: Dayjs) {
    setSelectedType(REPORT_TYPES[0]);
    setStartDate(presetStart ?? null);
    setEndDate(presetEnd ?? null);
    setIsGenerating(false);
    setIsComplete(false);
    setCurrentStep(0);
    setStepProgress(0);
    setModalOpen(true);
  }

  function handleCreate() {
    setIsGenerating(true);
    setCurrentStep(0);
    setStepProgress(0);

    let step = 0;
    stepIntervalRef.current = setInterval(() => {
      step += 1;
      if (step >= GENERATION_STEPS.length) {
        clearInterval(stepIntervalRef.current!);
        setTimeout(() => { setIsGenerating(false); setIsComplete(true); }, 400);
      } else {
        setCurrentStep(step);
        setStepProgress(0);
      }
    }, 900);
  }

  // Animate progress bar within each step
  useEffect(() => {
    if (!isGenerating) return;
    setStepProgress(0);
    const start = Date.now();
    const duration = 900;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      setStepProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [isGenerating, currentStep]);

  useEffect(() => {
    return () => { if (stepIntervalRef.current) clearInterval(stepIntervalRef.current); };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ py: 3 }}>
        <Stack gap={3}>
          <PageHeader
            pageTitle="Reports"
            pageSubtitle="Generated compliance reports across all connected products"
            breadcrumbs={
              <OverflowBreadcrumbs
                leadingElement={<NavLink to="/connected-compliance">Connected Compliance</NavLink>}
                items={[{ id: 'reports', label: 'Reports', url: '/reports' }]}
                hideLastItem
                aria-label="Breadcrumbs"
              >
                {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
              </OverflowBreadcrumbs>
            }
            buttonArray={
              <Button variant="contained" onClick={() => openModal()} sx={{ width: 'fit-content' }}>
                Create report
              </Button>
            }
          />

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 600, '& .MuiTableCell-root': { borderColor: 'divider', py: '10px', px: '12px' } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  {([
                    { label: 'Report', col: 'title' },
                    { label: 'Generated', col: 'date' },
                    { label: 'Status', col: 'status' },
                    { label: 'Type', col: 'type' },
                    { label: 'Actions', col: null },
                  ] as const).map(({ label, col }) => (
                    <TableCell key={label} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {col ? (
                        <TableSortLabel
                          active={orderBy === col}
                          direction={orderBy === col ? order : 'asc'}
                          onClick={() => handleSort(col)}
                        >
                          {label}
                        </TableSortLabel>
                      ) : label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map(({ title, dateLabel, status, statusColor, type, to }) => (
                  <TableRow key={title} hover={false} sx={{ opacity: to ? 1 : 0.5 }}>
                    <TableCell>
                      {to ? (
                        <MuiLink component="button" underline="hover" onClick={() => navigate(to)} sx={{ textAlign: 'left' }}>
                          <Typography variant="labelSm" sx={{ fontWeight: 600 }}>{title}</Typography>
                        </MuiLink>
                      ) : (
                        <Typography variant="labelSm" sx={{ fontWeight: 600 }}>{title}</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="textSm" color="text.secondary">{dateLabel}</Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <StatusIndicator label={status} color={statusColor} />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Chip
                        label={type}
                        size="small"
                        variant={type === 'Configured' ? 'filled' : 'outlined'}
                        sx={type === 'Configured' ? { bgcolor: 'primary.50', color: 'primary.main', borderColor: 'primary.200', fontWeight: 500 } : {}}
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Stack direction="row" gap={0.5}>
                        <Button size="small" variant="text" onClick={() => openModal()}>Duplicate</Button>
                        <Button size="small" variant="text" disabled={!to} onClick={() => to && navigate(to)}>Edit</Button>
                        <Button size="small" variant="text" disabled={!to} onClick={() => to && navigate(`${to}/share`)}>Share</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            component="div"
            count={REPORTS.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />

          <Stack gap={1}>
            <Typography variant="labelSm">About report types</Typography>
            <Stack gap={0.5}>
              <Typography variant="textSm" color="text.secondary">
                <strong>Standard</strong> — Generated directly from connected product data with no modifications. The report reflects the raw output of the AI analysis.
              </Typography>
              <Typography variant="textSm" color="text.secondary">
                <strong>Configured</strong> — A standard report that has been edited via the AI chat interface. The structure, content, or narrative has been adjusted by a user after generation.
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Create report modal */}
        {modalOpen && (
          <Box
            sx={{
              position: 'fixed', inset: 0, zIndex: 1300,
              bgcolor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Box sx={({ palette }) => ({ bgcolor: palette.background.paper, borderRadius: 2, p: 4, width: 480, boxShadow: 24 })}>
              <Typography variant="h3" sx={{ mb: 3 }}>Create report</Typography>

              {isComplete ? (
                <>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Your report has been generated and is ready to view.
                  </Typography>
                  <Stack gap={1.5}>
                    <Button variant="contained" fullWidth onClick={() => { setModalOpen(false); navigate('/reports/q1-2026'); }}>
                      View report
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ '&&': { color: '#d32f2f', borderColor: '#d32f2f', '&:hover': { borderColor: '#b71c1c', bgcolor: 'rgba(211,47,47,0.04)' } } }}>
                      Delete report
                    </Button>
                    <Button variant="text" fullWidth onClick={() => setModalOpen(false)}>
                      Close
                    </Button>
                  </Stack>
                </>
              ) : !isGenerating ? (
                <>
                  <Stack gap={2.5}>
                    <FormControl fullWidth>
                      <InputLabel>Report type</InputLabel>
                      <Select
                        value={selectedType}
                        label="Report type"
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        {REPORT_TYPES.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction="row" gap={2}>
                      <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={(v) => setStartDate(v)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                      <DatePicker
                        label="End date"
                        value={endDate}
                        onChange={(v) => setEndDate(v)}
                        minDate={startDate ?? undefined}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                      />
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Stack direction="row" gap={1} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create report</Button>
                  </Stack>
                </>
              ) : (
                <Stack gap={2.5}>
                  {GENERATION_STEPS.map((step, i) => {
                    const isDone = i < currentStep;
                    const isActive = i === currentStep;
                    return (
                      <Box key={step}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography
                            variant="textSm"
                            sx={{ color: isDone ? 'text.disabled' : isActive ? 'text.primary' : 'text.disabled' }}
                          >
                            {step}
                          </Typography>
                          {isDone && (
                            <Typography variant="labelXs" color="success.main">Done</Typography>
                          )}
                        </Stack>
                        {isActive && (
                          <LinearProgress variant="determinate" value={stepProgress} sx={{ height: 3, borderRadius: 2 }} />
                        )}
                        {isDone && (
                          <LinearProgress variant="determinate" value={100} sx={{ height: 3, borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: 'success.main' } }} />
                        )}
                      </Box>
                    );
                  })}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
                      setIsGenerating(false);
                      setModalOpen(false);
                    }}
                  >
                    Cancel report generation
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
}
