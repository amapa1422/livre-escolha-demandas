/* Cálculos locais sobre a lista autorizada já carregada. Sem rede ou dependências. */
(function () {
  'use strict';
  const DAY = 86400000;
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });
  const keys = ['pendente', 'andamento', 'lancada'];
  const names = ['Pendentes', 'Em andamento', 'Lançadas'];
  const colors = ['var(--amber)', 'var(--blue)', 'var(--green)'];
  const number = new Intl.NumberFormat('pt-BR');
  function ordinal(value) {
    const parts = Object.fromEntries(formatter.formatToParts(value).map(p => [p.type, p.value]));
    return Date.UTC(+parts.year, +parts.month - 1, +parts.day) / DAY;
  }
  function label(day) {
    const date = new Date(day * DAY);
    return String(date.getUTCDate()).padStart(2, '0') + '/' + String(date.getUTCMonth() + 1).padStart(2, '0');
  }
  function summarize(records, days = 7, now = Date.now()) {
    if (![7, 30, 90].includes(days)) throw new Error('Período inválido.');
    const end = ordinal(now), start = end - days + 1;
    const points = Array.from({ length: days }, (_, i) => ({ day: start + i, label: label(start + i), values: [0, 0, 0], total: 0 }));
    const counts = [0, 0, 0];
    // Datas fora da janela são descartadas antes da formatação por fuso.
    for (const row of records) {
      if (!Number.isFinite(row.created) || row.created > now || row.created < (start - 1) * DAY) continue;
      const status = keys.indexOf(row.status);
      if (status < 0) continue;
      const index = ordinal(row.created) - start;
      if (index < 0 || index >= days) continue;
      points[index].values[status]++; points[index].total++; counts[status]++;
    }
    let created = 0, done = 0;
    for (const point of points) { created += point.total; done += point.values[2]; point.accumulated = created; point.completed = done; }
    const total = counts.reduce((a, b) => a + b, 0);
    return { days, start, end, points, counts, total, rate: total ? Math.round(counts[2] / total * 100) : 0 };
  }
  const fmt = value => number.format(value);
  function axes(summary, maxValue) {
    const top = Math.max(1, Math.ceil(maxValue / 4)) * 4;
    let html = '';
    for (let i = 0; i <= 4; i++) {
      const y = 170 - i * 36;
      html += `<line class="chart-grid-line" x1="36" y1="${y}" x2="604" y2="${y}"/><text x="28" y="${y + 3}" text-anchor="end">${fmt(top * i / 4)}</text>`;
    }
    const stride = Math.ceil(summary.days / 6);
    summary.points.forEach((point, i) => {
      if ((i % stride === 0 && i < summary.days - 2) || i === summary.days - 1) {
        const x = 36 + (i + .5) * 568 / summary.days;
        html += `<text x="${x.toFixed(2)}" y="192" text-anchor="middle">${point.label}</text>`;
      }
    });
    return { html, top };
  }
  function daily(summary) {
    const axis = axes(summary, Math.max(...summary.points.map(p => p.total)));
    const step = 568 / summary.days, width = Math.min(32, step * .64);
    let html = axis.html;
    summary.points.forEach((point, i) => {
      let y = 170;
      html += `<g><title>${point.label}: ${point.total} demandas; ${names.map((name, j) => name + ': ' + point.values[j]).join('; ')}</title>`;
      point.values.forEach((value, j) => {
        const height = value / axis.top * 144; y -= height;
        html += `<rect x="${(36 + (i + .5) * step - width / 2).toFixed(2)}" y="${y.toFixed(2)}" width="${width.toFixed(2)}" height="${height.toFixed(2)}" rx="1" fill="${colors[j]}"/>`;
      });
      html += '</g>';
    });
    return `<svg viewBox="0 0 620 205" role="img" aria-label="Demandas criadas por dia nos últimos ${summary.days} dias, agrupadas pelo status atual"><title>${summary.total} demandas no período</title>${html}</svg>`;
  }
  function evolution(summary) {
    const axis = axes(summary, summary.total), step = 568 / summary.days;
    const coordinates = key => summary.points.map((p, i) => `${(36 + (i + .5) * step).toFixed(2)},${(170 - p[key] / axis.top * 144).toFixed(2)}`).join(' ');
    return `<div class="chart-legend"><span>Criadas</span><span class="legend-done">Lançadas atualmente</span></div><svg viewBox="0 0 620 205" role="img" aria-label="Evolução acumulada por data de criação: ${summary.total} criadas, ${summary.counts[2]} lançadas atualmente"><title>Acumulado da coorte criada no período, não é uma série de datas de conclusão</title>${axis.html}<polyline points="${coordinates('accumulated')}" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-linejoin="round"/><polyline points="${coordinates('completed')}" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  }
  function completion(summary) {
    const length = 2 * Math.PI * 60, done = length * summary.rate / 100;
    return `<div class="ring-row"><svg viewBox="0 0 160 160" role="img" aria-label="${summary.rate}% de conclusão"><circle class="ring-track" cx="80" cy="80" r="60"/><circle class="ring-progress" cx="80" cy="80" r="60" stroke-dasharray="${done.toFixed(3)} ${length.toFixed(3)}"/><text x="80" y="82" class="ring-number">${summary.rate}%</text></svg><div class="ring-copy"><strong>${fmt(summary.counts[2])} de ${fmt(summary.total)}</strong>demandas criadas no período estão lançadas.</div></div>`;
  }
  function distribution(summary) {
    return `<div class="status-distribution">${summary.counts.map((count, i) => {
      const percent = summary.total ? count / summary.total * 100 : 0;
      return `<div class="status-row"><div><span>${names[i]}</span><strong>${fmt(count)} · ${Math.round(percent)}%</strong></div><div class="status-track"><span class="status-fill" style="width:${percent.toFixed(3)}%;background:${colors[i]}"></span></div></div>`;
    }).join('')}</div>`;
  }
  function table(summary) {
    return `<table><caption>Criação diária e status atual no período selecionado</caption><thead><tr><th scope="col">Dia</th><th scope="col">Pend.</th><th scope="col">Andam.</th><th scope="col">Lanç.</th><th scope="col">Total</th></tr></thead><tbody>${summary.points.map(p => `<tr><th scope="row">${p.label}</th>${[...p.values, p.total].map(n => `<td>${fmt(n)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  window.LivreEscolhaDashboard = Object.freeze({ summarize, daily, evolution, completion, distribution, table });
})();
