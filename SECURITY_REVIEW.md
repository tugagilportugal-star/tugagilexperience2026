# Relatório de Segurança — TugÁgil Experience 2026

> Gerado em 2026-09-10. Análise do código-base completo (`api/`, autenticação admin, integração Stripe/Supabase/Resend/faturação) e das dependências (`npm audit`).

## Estado dos achados

- [ ] Vuln 1 — Relay de email não autenticado (`api/submit.ts`)
- [ ] Vuln 2 — Injeção de HTML em emails internos (`lib/notify.ts`, `api/webhook.ts`)
- [ ] Vuln 3 — Endpoint proxy de email morto e não autenticado (`api/send-email.ts`)
- [ ] Dependências — `npm audit fix`

---

## Vuln 1: Relay de email não autenticado com destinatário e conteúdo controlados pelo atacante — `api/submit.ts:14-60`

* **Severidade:** Alta
* **Categoria:** `unrestricted_email_relay` / `html_injection`
* **Descrição:** O endpoint `/api/submit` (POST) não exige autenticação e aceita `email` (destinatário) e `name` directamente do corpo do pedido. O valor de `name` é interpolado sem qualquer *escaping* em templates HTML (linhas 30, 34, 43) e o email é enviado via Resend a partir do domínio verificado da organização (`RESEND_FROM`, ex. `no-reply@rsglisbon.com`) para o endereço `to: email` fornecido pelo atacante.
* **Cenário de exploração:** Um atacante faz `POST /api/submit` com `{"type":"Lista de Interessados","name":"<html malicioso ou link de phishing>","email":"vitima@qualquerdominio.com"}`. O servidor envia, usando a conta Resend e o domínio de confiança da organização, um email com conteúdo HTML arbitrário para qualquer destinatário à escolha do atacante — viabilizando campanhas de phishing/spam que abusam da reputação de envio do domínio da TugÁgil, sem necessitar de credenciais.
* **Recomendação:** Validar/normalizar `name` (remover ou escapar `<`, `>`, `&`, `"`) antes de o injectar em HTML; restringir o endpoint com verificação de origem (CAPTCHA/hCaptcha) ou limite de confiança adicional; considerar não expor `to` livremente — associar o envio apenas ao email que fez o submit, sem permitir enviar para terceiros arbitrários sem relação com o pedido.

---

## Vuln 2: Injeção de HTML em emails internos de administração via nome do comprador — `lib/notify.ts:40,72` e `api/webhook.ts:40,53,59`

* **Severidade:** Média
* **Categoria:** `html_injection`
* **Descrição:** O nome do comprador (`session.customer_details?.name`, preenchido livremente pelo utilizador no Stripe Checkout) chega sem sanitização a `ctx.buyerName` e é interpolado diretamente no HTML da notificação enviada às contas de admin (`lib/notify.ts:72`, também no `subject`, linha 40) e nos emails de bilhete/fatura enviados ao próprio comprador (`generateTicketEmail`/`generateInvoiceEmail`).
* **Cenário de exploração:** Um atacante completa uma compra (mesmo de valor mínimo, com cupão) preenchendo o campo "nome" no checkout com HTML/link malicioso, ex. `Nome</p><p><a href="http://evil.example">Confirmar reembolso urgente</a>`. Quando o webhook processa o pagamento, a equipa de administração recebe um email interno com esse conteúdo injetado, podendo ser usado para phishing direcionado à equipa (que confia em emails automáticos do próprio sistema).
* **Recomendação:** Fazer *HTML-escape* (`&`, `<`, `>`, `"`, `'`) de todos os campos controlados pelo utilizador (`buyerName`, nomes de participantes, `billing_name`, etc.) antes de os inserir em templates HTML de email, tanto nos emails para clientes como, especialmente, nos de notificação interna.

---

## Vuln 3: Endpoint proxy de email genérico, não autenticado e sem utilização no frontend — `api/send-email.ts`

* **Severidade:** Média
* **Categoria:** `unrestricted_email_relay`
* **Descrição:** `/api/send-email` aceita `to`, `subject`, `html`, `from` e `apiKey` directamente do corpo do pedido, sem autenticação, e reencaminha para a API do Resend. Confirmado por grep que este endpoint **não é chamado por nenhum componente do frontend** — é código morto, mas continua implantado e publicamente acessível em produção (Vercel expõe qualquer ficheiro em `api/` como função).
* **Cenário de exploração:** Qualquer pessoa com uma chave Resend própria (gratuita) pode usar a infraestrutura/domínio Vercel da aplicação como proxy para enviar email arbitrário, potencialmente atraindo denúncias de abuso contra o projeto/domínio, e aumentando a superfície de ataque sem qualquer benefício funcional.
* **Recomendação:** Remover este endpoint (é código morto) ou, se necessário manter, exigir autenticação de admin (`verifyAdminToken`) tal como os restantes endpoints administrativos.

---

## Pontos verificados e considerados seguros

- **Autenticação admin** (`lib/admin/auth.ts`, `api/admin.ts`, `api/admin/*.ts`): token Bearer validado server-side via `supabase.auth.getUser()` + verificação de `role` na tabela `admin_users` com a *service role key*; gates de `canEdit`/`superadmin` aplicados corretamente em todas as rotas mutáveis, incluindo o refund/nota de crédito e gestão de admins.
- **Webhook Stripe** (`api/webhook.ts`): assinatura validada via `stripe.webhooks.constructEvent` com `STRIPE_WEBHOOK_SECRET`; sem essa verificação, sem processamento.
- **Checkout** (`api/checkout.ts`): preços e descontos recalculados sempre no servidor a partir da BD — não há confiança em preços vindos do cliente.
- **Consultas Supabase**: uso consistente do query builder (`.eq()`, `.select()`), sem SQL bruto — sem risco de SQL injection.
- **Chaves client-side** (`lib/supabaseClient.ts`): apenas a `anon key` do Supabase é exposta ao browser, como esperado (protegida por RLS no lado da BD).
- Nenhum uso de `dangerouslySetInnerHTML`/`eval`/`innerHTML` com conteúdo dinâmico controlado por utilizador.

---

## Dependências (`npm audit`)

23 vulnerabilidades reportadas (1 crítica, 16 altas, 4 médias, 2 baixas), mas **quase todas são de negação de serviço (ReDoS/DoS) em dependências de build/dev** (`vite`, `postcss`, `browserslist`, `@vercel/*`, `tar`, `undici`, `js-yaml`, etc.) — não afetam diretamente o runtime das funções serverless em produção. Não são achados de exploração direta, mas recomenda-se:

- `npm audit fix` (resolve a maioria sem breaking changes).
- Avaliar `npm audit fix --force` (atualiza `@vercel/node` para v4 — testar antes de aplicar em produção).
