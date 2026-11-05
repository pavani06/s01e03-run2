<script lang="ts">
  import { problemsIn } from '#lib/kb/problems';

  // tickets: problem id → where its ticket lives, e.g. { parser: 'https://github.com/…/issues/1' }
  let { ticket, tickets = {} }: { ticket: number; tickets?: Record<string, string> } = $props();

  const view = $derived(problemsIn(ticket));
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
        <td><code>{p.id}</code></td>
        <td>{p.reports.length}</td>
        <td>{p.tenants}</td>
        <td>{p.firstSeen} → {p.lastSeen}</td>
        <td>{#if tickets[p.id]}<a href={tickets[p.id]}>{tickets[p.id].split('/').slice(-1)[0].replace(/^/, '#')}</a>{:else}—{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<p class="note">
  {view.oneDay} reports read as a one-day move (<code>desk-notes.json</code>); filed under
  <code>{view.oneDayUnder.join(', ')}</code> by tenant and counted there, as in the desk's cause table.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
