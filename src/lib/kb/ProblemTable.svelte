<script lang="ts">
  import { problemsIn } from '#lib/kb/problems';

  // tickets: problem id → where its ticket lives, e.g. { parser: 'https://github.com/…/issues/1' }
  let { ticket, tickets = {} }: { ticket: number; tickets?: Record<string, string> } = $props();

  const view = $derived(problemsIn(ticket));
  const label = (id: string) => (id === 'one-day' ? 'one-day move' : id);
</script>

<p class="sum">
  <strong>{view.merged}</strong> reports merged into #{ticket} ·
  <strong>{view.problems.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each view.problems as p (p.id)}
      <tr>
        <td><code>{label(p.id)}</code></td>
        <td>{p.reports.length}</td>
        <td>{p.tenants}</td>
        <td>{p.firstSeen} → {p.lastSeen}</td>
        <td>{#if tickets[p.id]}<a href={tickets[p.id]}>{tickets[p.id].split('/').slice(-1)[0].replace(/^/, '#')}</a>{:else}—{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  The {view.problems.find((p) => p.id === 'one-day')?.reports.length} one-day reports are also inside the
  <code>{view.oneDayUnder.join(', ')}</code> count, where the desk files them by tenant.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
