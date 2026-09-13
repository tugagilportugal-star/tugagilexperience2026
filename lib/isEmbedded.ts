// True when the app is rendered inside an iframe (ex: embutido no Wix).
// Usado para evitar alturas baseadas em vh/min-h-screen, que dentro de um
// iframe se referem à altura atribuída ao próprio iframe, não ao ecrã do
// visitante — o que causa um efeito de "alvo que foge" ao tentar ajustar a
// altura manualmente no Wix.
export const isEmbedded =
  typeof window !== 'undefined' && window.self !== window.top;
