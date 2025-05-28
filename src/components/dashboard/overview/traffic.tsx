'use client';

import * as React from 'react';
import { BettingHistoryInterface } from '@/utils/interfaces/bet-history.interface';
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

export interface FilterProps {
  betHistories: BettingHistoryInterface[];
  labels: string[];
  sx?: SxProps;
  onFilterChange?: (filters: {
    filterType: string;
    year: number;
    month?: number;
    week?: number;
    startDate?: Dayjs;
    endDate?: Dayjs;
  }) => void;
}

// Custom theme for consistent styling
const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          maxWidth: 400,
          width: '100%',
          margin: 'auto',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          minWidth: 120,
          width: '100%',
        },
      },
    },
  },
});

export function Filter({ betHistories, labels, sx, onFilterChange }: FilterProps): React.JSX.Element {
  const [filterType, setFilterType] = React.useState('week');
  const [selectedYear, setSelectedYear] = React.useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().startOf('month'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs().endOf('month'));

  // Extract available years, months, and weeks from labels
  const availableYears = React.useMemo(() => {
    const years = new Set<number>();
    labels.forEach((label) => {
      const year = dayjs(label).year();
      if (!isNaN(year)) years.add(year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [labels]);

  const availableMonths = React.useMemo(() => {
    if (filterType !== 'month' && filterType !== 'week') return [];
    const months = new Set<number>();
    labels.forEach((label) => {
      const date = dayjs(label);
      if (date.year() === selectedYear) months.add(date.month() + 1);
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [labels, selectedYear, filterType]);

  const availableWeeks = React.useMemo(() => {
    if (filterType !== 'week') return [];
    const weeks = new Set<number>();
    labels.forEach((label) => {
      const date = dayjs(label) as any;
      if (date.year() === selectedYear && (!selectedMonth || date.month() + 1 === selectedMonth)) {
        weeks.add(date.week());
      }
    });
    return Array.from(weeks).sort((a, b) => a - b);
  }, [labels, selectedYear, selectedMonth, filterType]);

  // Notify parent of filter changes
  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        filterType,
        year: selectedYear,
        month: selectedMonth || undefined,
        week: selectedWeek || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
    }
  }, [filterType, selectedYear, selectedMonth, selectedWeek, startDate, endDate]);

  return (
    <ThemeProvider theme={theme}>
      <Card sx={sx}>
        <CardHeader title="Filter Options" />
        <CardContent>
          <Stack spacing={2}>
            {/* Filter Type */}
            <FormControl>
              <InputLabel id="filter-type-label">Filter Type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                label="Filter Type"
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setSelectedMonth(null);
                  setSelectedWeek(null);
                }}
              >
                <MenuItem value="week">By Week</MenuItem>
                <MenuItem value="month">By Month</MenuItem>
                <MenuItem value="year">By Year</MenuItem>
              </Select>
            </FormControl>

            {/* Year */}
            <FormControl>
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Month (only for month/week filter) */}
            {(filterType === 'month' || filterType === 'week') && (
              <FormControl>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  value={selectedMonth ?? ''}
                  label="Month"
                  onChange={(e) => {
                    const month = Number(e.target.value);
                    setSelectedMonth(month);
                    setSelectedWeek(null);
                  }}
                >
                  {availableMonths.map((month) => (
                    <MenuItem key={month} value={month}>
                      {`Month ${month}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Week (only for week filter) */}
            {filterType === 'week' && (
              <FormControl>
                <InputLabel id="week-label">Week</InputLabel>
                <Select
                  labelId="week-label"
                  value={selectedWeek ?? ''}
                  label="Week"
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                >
                  {availableWeeks.map((week) => (
                    <MenuItem key={week} value={week}>
                      {`Week ${week}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Start Date */}
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            {/* End Date */}
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
