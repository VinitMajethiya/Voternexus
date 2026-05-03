import { ElectionPhase } from '@/types';
import electionSchedule from '@/data/election-schedule.json';
import { differenceInCalendarDays, isSameDay, parseISO } from 'date-fns';

export function getElectionPhase(targetDate: Date = new Date(), state?: string, constituency?: string): ElectionPhase {
  // Find the relevant schedule entry
  // For MVP/Scaffold, we use the first entry if no state/constituency is provided
  const schedule = electionSchedule.find(s => 
    (!state || s.state === state) && (!constituency || s.constituency === constituency)
  ) || electionSchedule[0];

  if (!schedule) return 'pre-election';

  const pollingDay = parseISO(schedule.polling_day);
  const countingDay = parseISO(schedule.counting_day);
  const daysToPolling = differenceInCalendarDays(pollingDay, targetDate);

  if (isSameDay(targetDate, pollingDay)) {
    return 'election-day';
  }

  if (targetDate > pollingDay) {
    return 'post-election';
  }

  if (daysToPolling <= 7) {
    return 'election-week';
  }

  if (daysToPolling <= 60) {
    return 'campaign';
  }

  return 'pre-election';
}
