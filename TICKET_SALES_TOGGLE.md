# Venda de Bilhetes — Desativação Temporária (2026-09-10)

## Porque foi desligada

Os botões de "Comprar Bilhete" ficaram **ocultos** no frontend porque, neste momento:

1. Os emails de confirmação/fatura disparados pelo checkout (`api/webhook.ts`, `api/admin/resend-email.ts`) ainda referem o evento antigo — "RSG Lisbon 2026", 21 de Maio, Auditório Alto dos Moinhos (Lisboa) — em vez do evento atual anunciado no site: **TugÁgil Experience, 21 de Novembro de 2026, ISLA Gaia (Vila Nova de Gaia)**. Quem comprasse agora receberia informação errada.
2. Ainda não foi implementada a lógica de estado "lote ativo / esgotado / lista de espera" (discutida e planeada, ver secção "Próximo passo" abaixo).

Enquanto isto não for corrigido, não deve haver forma de iniciar uma compra real no site.

## O que foi alterado

Foi criado **um único ponto de controlo**: a flag `TICKETS_ON_SALE` em `config.ts`.

```ts
// config.ts
export const TICKETS_ON_SALE = false;
```

Esta flag foi usada para **esconder** (não apagar) os botões/blocos de compra nos seguintes locais:

| Ficheiro | O que foi envolvido em `{TICKETS_ON_SALE && (...)}` |
|---|---|
| `sections/Hero.tsx` | Botão "Adquirir Bilhete" (mantém-se só o botão "Quero Patrocinar o Evento") |
| `components/NavBar.tsx` | Botão "Comprar Bilhete" no desktop **e** no menu mobile |
| `sections/Agenda.tsx` | Botão "Comprar Bilhete" na barra de topo **e** todo o bloco final "Bilhetes Disponíveis / Garantir Bilhete" |

Nada mais foi tocado:
- `TicketPurchaseModal`, `/api/checkout`, `/api/get-ticket`, `/api/validate-coupon`, `api/webhook.ts` continuam exatamente como estavam — só deixaram de ser alcançáveis a partir da UI pública porque não há botão que abra o modal.
- Os endpoints continuam publicados (ninguém os desativou no backend). Se for preciso um bloqueio mais forte no futuro (ex.: impedir chamadas diretas a `/api/checkout`), isso é uma decisão separada — não foi feito aqui.

## Como reverter (religar a venda)

**Reversão simples/imediata:** mudar uma linha em `config.ts`:

```diff
- export const TICKETS_ON_SALE = false;
+ export const TICKETS_ON_SALE = true;
```

Isto volta a mostrar todos os botões de compra exatamente como estavam antes desta alteração — nenhum outro ficheiro precisa de ser tocado.

## Próximo passo planeado (não implementado ainda)

Antes de religar, ficou definido (nesta conversa) substituir o toggle binário por um estado derivado dos dados em `ticket_types` (Supabase), usando o hook já existente `hooks/useTicketStatus.tsx` (hoje construído mas não consumido por nenhum componente):

- **Ativo** → existe lote com `active=true` e `quantity_sold < quantity_total` → mostra botão de compra normal.
- **Esgotado** → existem lotes em `ticket_types`, mas nenhum disponível → mostra "Esgotado" + formulário de lista de espera.
- **Pré-lista** → não existe nenhum lote criado ainda → mostra "Lista de Interesse" + mesmo formulário de lista de espera (copy diferente).

O formulário de lista de espera pode reaproveitar `sections/Tickets.tsx` (hoje órfã, não importada em `App.tsx`), que já posta para `/api/submit` com os tipos `'Priority List Sold Out'` / `'Lista de Interessados'` (o backend já trata os dois).

Quando este trabalho for feito, o toggle `TICKETS_ON_SALE` deixa de ser necessário — pode ser removido, porque o próprio estado dos dados passa a decidir o que mostrar.

## Checklist antes de religar

- [ ] Corrigir data/local/nome do evento nos templates de email (`api/webhook.ts`, `api/admin/resend-email.ts`) e nas páginas `sections/Agenda.tsx` / `sections/Benefits.tsx` que ainda dizem "Regional Scrum Gathering Lisbon 2026".
- [ ] Confirmar que existe pelo menos um `ticket_type` com `active=true` no Supabase.
- [ ] Confirmar variáveis de ambiente na Vercel (`STRIPE_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.).
- [ ] (Opcional, recomendado) Implementar o estado Ativo/Esgotado/Pré-lista descrito acima em vez de simplesmente pôr `TICKETS_ON_SALE = true`.
