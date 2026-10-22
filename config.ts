// src/config.ts

// Master switch for showing the ticket-purchase CTAs (Hero, NavBar, Agenda).
// Controlled per environment by the Vercel env var VITE_TICKETS_ON_SALE:
//   "true"  → venda aberta ao público
//   "test"  → venda fechada, exceto para quem abre o site com ?venda=<chave>
//             (a chave é validada no servidor contra TICKETS_TEST_KEY)
//   outro / vazio → venda fechada
// It is baked in at build time, so changing it requires a redeploy.
// See TICKET_SALES_TOGGLE.md for the history.
const TICKETS_SALE_MODE = import.meta.env.VITE_TICKETS_ON_SALE;

// Chave do modo "test": lida do URL e guardada na sessão para sobreviver à navegação
function readSaleKey(): string | null {
  if (TICKETS_SALE_MODE !== 'test' || typeof window === 'undefined') return null;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('venda');
    if (fromUrl) window.sessionStorage.setItem('venda', fromUrl);
    return fromUrl || window.sessionStorage.getItem('venda');
  } catch {
    return null;
  }
}

export const TICKETS_SALE_KEY = readSaleKey();
export const TICKETS_ON_SALE = TICKETS_SALE_MODE === 'true' || Boolean(TICKETS_SALE_KEY);

export const ASSETS = {
  // Imagens de fundo
  HERO_BG: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80",
  GROUP_PHOTO_BG: "https://i.postimg.cc/xCHQMjQ4/Tugagil-608.jpg",
  GAIA_BG: "/assets/Vila-Nova-de-Gaia.jpeg",

  // Logótipos do TugÁgil Experience
  TUGAGIL_LOGO: "/assets/TUGAGIL_LOGO.png",
  TUGAGIL_EXPERIENCE_LOGO: "/assets/TUGAGIL_EXP_SEMFUNDO.png",
  ISLA_GAIA_LOGO: "/assets/Isla-Gaia-Logo.png",

  // Mantidos temporariamente para evitar erros de compilação no NavBar e Sponsors
  SPONSOR_LOGO: "https://i.postimg.cc/xCHQMjQ4/Tugagil-608.jpg",
  SCRUM_ALLIANCE_LOGO: "https://i.postimg.cc/xCHQMjQ4/Tugagil-608.jpg",
  ATELIE_LOGO: "https://i.postimg.cc/xCHQMjQ4/Tugagil-608.jpg",
  TABAQUEIRA_LOGO: "https://i.postimg.cc/xCHQMjQ4/Tugagil-608.jpg",

  RECAP_VIDEO: "",
  RECAP_VIDEO_POSTER: "",
  
  GALLERY_IMAGES: [
    "https://i.postimg.cc/CxX1nH6r/Tugagil-18.jpg",
    "https://i.postimg.cc/Y2RCzwsz/Tugagil-32.jpg",
    "https://i.postimg.cc/TPj62V8J/Tugagil-186.jpg",
    "https://i.postimg.cc/pT03yksV/Tugagil-282.jpg",
    "https://i.postimg.cc/7LxCg888/Tugagil-447.jpg",
    "https://i.postimg.cc/qMqH61ZK/Tugagil-51.jpg",
    "https://i.postimg.cc/qq7Sn7QN/Tugagil-58.jpg",
    "https://i.postimg.cc/qvcwJTXW/Tugagil-610.jpg",
    "https://i.postimg.cc/br20Kcwk/Tugagil-618.jpg",
  ],
};