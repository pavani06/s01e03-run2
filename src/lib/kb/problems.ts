// The problems inside a merged ticket, counted the desk's way: causes.ts decides each report's cause,
// desk-notes.json lists the reports the desk read as a one-day move. Nothing here is typed in by hand.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import { groupByCause, readAs, ticketCause, uniqueById, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

export type Problem = {
  id: 'parser' | 'hint';
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

function span(rs: Report[]) {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return { tenants: new Set(rs.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] };
}

export function problemsIn(ticket: number) {
  const merged = uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf);
  const owner = ticketCause(groups, ticket);
  const byCause = (cause: 'parser' | 'hint') => groups.find((g) => g.cause === cause)?.reports ?? [];
  const oneDay = merged.filter((r) => notes.oneDayMove.includes(r.id));
  // The desk's view: the one-day reports stay counted where its cause table files them, and are footnoted.
  const problems: Problem[] = [
    { id: 'parser', reports: byCause('parser'), ...span(byCause('parser')) },
    { id: 'hint', reports: byCause('hint'), ...span(byCause('hint')) },
  ];
  const oneDayUnder = groups.filter((g) => readAs(g, notes.oneDayMove) > 0).map((g) => g.cause);
  return { merged: merged.length, owner, problems, oneDay: oneDay.length, oneDayUnder };
}
