import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { MoodEntry, MoodType } from '../../types';
import { TrendingUp, BarChart2, Calendar, Sparkles, Info } from 'lucide-react';
import { MOOD_OPTIONS } from '../home/HomeCheckInCard';

interface MoodTrendsChartProps {
  entries: MoodEntry[];
}

const MOOD_LEVEL_MAP: Record<MoodType, number> = {
  low: 1,
  stressed: 2,
  okay: 3,
  good: 4,
  great: 5,
};

const MOOD_LABEL_MAP: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: 'Low', emoji: '😞', color: '#B97375' },
  2: { label: 'Stressed', emoji: '😟', color: '#D48C70' },
  3: { label: 'Okay', emoji: '😐', color: '#A09D80' },
  4: { label: 'Good', emoji: '🙂', color: '#6A9073' },
  5: { label: 'Great', emoji: '😄', color: '#58715B' },
};

export const MoodTrendsChart: React.FC<MoodTrendsChartProps> = ({ entries }) => {
  const [chartType, setChartType] = useState<'timeline' | 'distribution'>('timeline');

  // Build full 30-day chronological timeline
  const timelineData = useMemo(() => {
    const days: { date: string; displayDate: string; moodValue?: number; moodType?: MoodType; note?: string }[] = [];
    const now = new Date();

    // Map existing entries by date string (YYYY-MM-DD)
    const entryMap = new Map<string, MoodEntry>();
    entries.forEach((e) => {
      const dStr = e.dateStr || new Date(e.timestamp).toISOString().split('T')[0];
      if (!entryMap.has(dStr) || e.timestamp > entryMap.get(dStr)!.timestamp) {
        entryMap.set(dStr, e);
      }
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      const entry = entryMap.get(dateKey);
      if (entry) {
        days.push({
          date: dateKey,
          displayDate,
          moodValue: MOOD_LEVEL_MAP[entry.mood],
          moodType: entry.mood,
          note: entry.note,
        });
      } else {
        days.push({
          date: dateKey,
          displayDate,
          moodValue: undefined,
        });
      }
    }
    return days;
  }, [entries]);

  // Aggregate distribution of moods in the last 30 days
  const distributionData = useMemo(() => {
    const counts: Record<MoodType, number> = {
      great: 0,
      good: 0,
      okay: 0,
      stressed: 0,
      low: 0,
    };

    entries.forEach((e) => {
      if (counts[e.mood] !== undefined) {
        counts[e.mood]++;
      }
    });

    return [
      { mood: 'Great', type: 'great', count: counts.great, emoji: '😄', color: '#58715B' },
      { mood: 'Good', type: 'good', count: counts.good, emoji: '🙂', color: '#6A9073' },
      { mood: 'Okay', type: 'okay', count: counts.okay, emoji: '😐', color: '#97A598' },
      { mood: 'Stressed', type: 'stressed', count: counts.stressed, emoji: '😟', color: '#D48C70' },
      { mood: 'Low', type: 'low', count: counts.low, emoji: '😞', color: '#B97375' },
    ];
  }, [entries]);

  // Summary Metrics
  const validEntries = timelineData.filter((d) => d.moodValue !== undefined);
  const totalLogged = validEntries.length;
  const averageValue = totalLogged > 0
    ? (validEntries.reduce((acc, curr) => acc + (curr.moodValue || 0), 0) / totalLogged).toFixed(1)
    : '3.0';

  const mostFrequentMood = useMemo(() => {
    if (distributionData.length === 0) return 'Okay';
    const sorted = [...distributionData].sort((a, b) => b.count - a.count);
    return `${sorted[0].emoji} ${sorted[0].mood}`;
  }, [distributionData]);

  // Custom Tooltip for Timeline
  const CustomTimelineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (!data.moodValue) {
        return (
          <div className="bg-white p-2.5 rounded-xl border border-[#DCE4D6] shadow-sm text-xs">
            <span className="font-semibold text-[#293A30] block">{data.displayDate}</span>
            <span className="text-[#687168] italic text-[11px]">No check-in recorded</span>
          </div>
        );
      }

      const moodInfo = MOOD_LABEL_MAP[data.moodValue];
      return (
        <div className="bg-white p-3 rounded-xl border border-[#DCE4D6] shadow-md text-xs max-w-xs space-y-1">
          <div className="flex items-center justify-between gap-2 border-b border-[#F0F4EE] pb-1">
            <span className="font-semibold text-[#293A30]">{data.displayDate}</span>
            <span className="text-sm select-none">{moodInfo?.emoji}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold" style={{ color: moodInfo?.color }}>
            <span>{moodInfo?.label}</span>
            <span className="text-[10px] text-[#687168] font-normal">({data.moodValue}/5 level)</span>
          </div>
          {data.note && (
            <p className="text-[11px] text-[#4F5B50] italic bg-[#F7F5EF] p-1.5 rounded-lg mt-1 border-l-2 border-[#58715B]">
              &ldquo;{data.note}&rdquo;
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9EEE5] shadow-xs">
      {/* Header and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E9EEE5] text-[#58715B]">
              <TrendingUp size={16} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#293A30]">
              30-Day Mood Trends
            </h3>
          </div>
          <p className="text-xs text-[#687168] mt-0.5">
            Notice patterns across teaching weeks without judgment or clinical scores.
          </p>
        </div>

        {/* View Switcher */}
        <div className="inline-flex p-1 bg-[#F7F5EF] rounded-xl border border-[#E9EEE5] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              chartType === 'timeline'
                ? 'bg-white text-[#58715B] shadow-2xs'
                : 'text-[#687168] hover:text-[#293A30]'
            }`}
          >
            <Calendar size={13} />
            <span>Timeline</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              chartType === 'distribution'
                ? 'bg-white text-[#58715B] shadow-2xs'
                : 'text-[#687168] hover:text-[#293A30]'
            }`}
          >
            <BarChart2 size={13} />
            <span>Distribution</span>
          </button>
        </div>
      </div>

      {/* 30-Day Metric Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="p-3 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687168] block">
            Check-ins Logged
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#58715B] mt-0.5 block">
            {totalLogged} <span className="text-xs font-normal text-[#687168]">/ 30 days</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687168] block">
            Most Common Mood
          </span>
          <span className="text-sm sm:text-base font-bold text-[#293A30] mt-1 block truncate">
            {mostFrequentMood}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#F4F7F2] border border-[#DCE4D6] text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#687168] block">
            30-Day Average Pace
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#58715B] mt-0.5 block">
            {averageValue} <span className="text-xs font-normal text-[#687168]">/ 5.0</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {chartType === 'timeline' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodColorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58715B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E9EEE5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EEE5" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#687168"
                fontSize={10}
                tickLine={false}
                interval={4}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(value) => {
                  const m = MOOD_LABEL_MAP[value];
                  return m ? m.emoji : '';
                }}
                stroke="#687168"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTimelineTooltip />} />
              <Area
                type="monotone"
                dataKey="moodValue"
                stroke="#58715B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#moodColorGradient)"
                connectNulls={true}
                dot={{ r: 3, fill: '#58715B', strokeWidth: 1, stroke: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#58715B', stroke: '#E9EEE5', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E9EEE5" vertical={false} />
              <XAxis
                dataKey="mood"
                stroke="#687168"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val, i) => `${distributionData[i]?.emoji} ${val}`}
              />
              <YAxis
                allowDecimals={false}
                stroke="#687168"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value: any, name: any, item: any) => [
                  `${value} check-ins (${item.payload.emoji})`,
                  'Frequency',
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #DCE4D6',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Descriptive guidance note adhering to Section 9 */}
      <div className="mt-4 pt-3 border-t border-[#E9EEE5] flex items-start gap-2 text-[11px] text-[#687168] leading-relaxed">
        <Info size={14} className="text-[#58715B] shrink-0 mt-0.5" />
        <p>
          <strong>Self-Reflection Guide:</strong> Fluctuations in mood are natural responses to fluctuating classroom demands, deadlines, and rest. This visualization is intended to notice what helps you recharge; it is not a clinical assessment or diagnostic score.
        </p>
      </div>
    </div>
  );
};
