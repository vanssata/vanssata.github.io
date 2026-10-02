const { createApp, ref, computed, onMounted, watch } = Vue;

const FAV = (domain) =>
  `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;

const ICON_MAP = {
  // Backend languages
  PHP: "devicon-php-plain colored",
  Python: "devicon-python-plain colored",
  "Node.js": "devicon-nodejs-plain colored",
  Bash: "devicon-bash-plain colored",
  // Backend frameworks
  Symfony: "devicon-symfony-original colored",
  "API Platform": FAV("api-platform.com"),
  Laravel: "devicon-laravel-plain colored",
  CodeIgniter: "devicon-codeigniter-plain colored",
  Doctrine: FAV("doctrine-project.org"),
  Django: "devicon-django-plain colored",
  // CMS
  Joomla: FAV("joomla.org"), // devicon 2.16 has no Joomla glyph
  WordPress: "devicon-wordpress-plain colored",
  DjangoCMS: FAV("django-cms.org"),
  // E-commerce
  Sylius: FAV("sylius.com"),
  "Magento 2": "devicon-magento-original colored",
  Shopware: "devicon-shopware-original colored",
  OpenCart: FAV("opencart.com"),
  // APIs & integration
  "REST APIs": "fa-solid fa-plug",
  "OpenAPI / Swagger": "devicon-swagger-plain colored",
  SOAP: "fa-solid fa-code",
  "Payment providers": "fa-solid fa-credit-card",
  Плащания: "fa-solid fa-credit-card",
  "ERP/CRM integration": "fa-solid fa-arrows-rotate",
  "ERP/CRM": "fa-solid fa-arrows-rotate",
  // Databases
  PostgreSQL: "devicon-postgresql-plain colored",
  MySQL: "devicon-mysql-plain colored",
  MariaDB: "devicon-mariadb-original colored",
  PerconaDB: FAV("percona.com"),
  SQLite: "devicon-sqlite-plain colored",
  Redis: "devicon-redis-plain colored",
  // Caching & Queuing
  "PSR-6": FAV("php-fig.org"),
  Varnish: FAV("varnish-software.com"),
  RabbitMQ: "devicon-rabbitmq-original colored",
  AMQP: "devicon-rabbitmq-original colored",
  // Testing
  PHPUnit: FAV("phpunit.de"),
  Behat: FAV("behat.org"),
  Playwright: "devicon-playwright-plain colored",
  // DevOps
  "GitHub Actions": "devicon-githubactions-plain colored",
  Docker: "devicon-docker-plain colored",
  "Docker Compose": "devicon-docker-plain colored",
  "Docker Swarm": "devicon-docker-plain colored",
  "GitLab CI": "devicon-gitlab-plain colored",
  Linode: FAV("linode.com"),
  Kubernetes: "devicon-kubernetes-plain colored",
  Helm: "devicon-helm-original colored",
  "Argo CD": "devicon-argocd-plain colored",
  GitOps: "devicon-git-plain colored",
  k3d: FAV("k3d.io"),
  Traefik: "devicon-traefikproxy-plain colored",
  // Frontend JS
  jQuery: "devicon-jquery-plain colored",
  "Vue.js": "devicon-vuejs-plain colored",
  React: "devicon-react-plain colored",
  "Alpine.js": "devicon-alpinejs-original colored",
  Stimulus: FAV("stimulus.hotwired.dev"),
  Turbo: FAV("turbo.hotwired.dev"),
  KnockoutJS: FAV("knockoutjs.com"),
  TypeScript: "devicon-typescript-plain colored",
  // CSS / Build
  SCSS: "devicon-sass-original colored",
  "Bootstrap 5": "devicon-bootstrap-plain colored",
  webpack: "devicon-webpack-plain colored",
  yarn: "devicon-yarn-plain colored",
  Vite: "devicon-vitejs-plain colored",
  Twig: FAV("twig.symfony.com"),
  "Design tokens": "devicon-figma-plain colored",
  "Shopware 6 themes": "devicon-shopware-original colored",
  // AI
  "GitHub Copilot (Codex)": "devicon-github-original colored",
  "Anthropic Claude": FAV("anthropic.com"),
  "JetBrains Junie": FAV("jetbrains.com"),
  "Agentic SDLC pipelines": FAV("anthropic.com"),
  "Agentic SDLC процеси": FAV("anthropic.com"),
  "Custom agents, skills & hooks": FAV("anthropic.com"),
  "Собствени агенти, skills и hooks": FAV("anthropic.com"),
  "Custom MCP commands": FAV("modelcontextprotocol.io"),
  "Собствени MCP команди": FAV("modelcontextprotocol.io"),
  "AI-driven E2E testing (Playwright)": FAV("playwright.dev"),
  "E2E тестове с AI (Playwright)": FAV("playwright.dev"),
  "Problem analysis & solution design": FAV("anthropic.com"),
  "Анализ на проблема и дизайн на решението": FAV("anthropic.com"),
  "Анализ и дизайн на решения": FAV("anthropic.com"),
  "Spec-driven development": FAV("anthropic.com"),
  "Spec-driven разработка": FAV("anthropic.com"),
  "Risk-tiered review gates": FAV("anthropic.com"),
  "Review gates по ниво на риск": FAV("anthropic.com"),
  "Context engineering": FAV("anthropic.com"),
  "Model routing": FAV("anthropic.com"),
  "Маршрутизация на модели": FAV("anthropic.com"),
  "Token & cost budgeting": FAV("anthropic.com"),
  "Бюджет за токени и разходи": FAV("anthropic.com"),
  "Agent evals & benchmarking": FAV("playwright.dev"),
  "Оценка и бенчмаркове на агенти": FAV("playwright.dev"),
};

// ?cv=<name> lays translations/variants/<name>/<lang>.json over the base CV.
// A variant holds only what it changes: objects merge key by key and the
// variant's key order wins (that is how it reorders skill categories),
// arrays and strings replace the base value whole, and null drops a key.
const VARIANT = (() => {
  const v = new URLSearchParams(location.search).get("cv");
  return v && /^[a-z0-9-]+$/.test(v) ? v : null;
})();

const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

function overlay(base, over) {
  if (!isObject(base) || !isObject(over)) return over;
  const out = {};
  for (const [k, v] of Object.entries(over)) {
    if (v !== null) out[k] = k in base ? overlay(base[k], v) : v;
  }
  for (const [k, v] of Object.entries(base)) {
    if (!(k in over)) out[k] = v;
  }
  return out;
}

async function loadJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.json();
}

async function loadLanguage(lang) {
  const base = await loadJSON(`translations/${lang}.json`);
  if (!VARIANT) return base;
  try {
    return overlay(
      base,
      await loadJSON(`translations/variants/${VARIANT}/${lang}.json`),
    );
  } catch {
    return base; // unknown variant: show the plain CV, not a blank page
  }
}

// A variant is cut for one kind of role and sent by link; the base CV is the
// page search engines should know.
if (VARIANT) {
  const robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex";
  document.head.append(robots);
}

createApp({
  setup() {
    const storedDark = localStorage.getItem("cv-dark");
    const darkMode = ref(
      storedDark !== null
        ? storedDark === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    const lang = ref(localStorage.getItem("cv-lang") || "en");
    const translations = ref({ en: null, bg: null });
    const loading = ref(true);

    function applyTheme() {
      document.documentElement.setAttribute(
        "data-bs-theme",
        darkMode.value ? "dark" : "light",
      );
      localStorage.setItem("cv-dark", darkMode.value);
    }

    applyTheme();

    onMounted(async () => {
      try {
        const [en, bg] = await Promise.all([
          loadLanguage("en"),
          loadLanguage("bg"),
        ]);
        translations.value = { en, bg };
      } finally {
        loading.value = false;
      }
    });

    const t = computed(() => translations.value[lang.value] || {});

    watch(
      lang,
      (v) => {
        localStorage.setItem("cv-lang", v);
        document.documentElement.lang = v;
      },
      { immediate: true },
    );

    watch(darkMode, applyTheme);

    // Title and description live in the translations, so they follow the
    // language instead of staying on whatever index.html shipped with.
    watch(
      t,
      (v) => {
        if (!v.meta) return;
        if (v.meta.title) document.title = v.meta.title;
        const desc = document.querySelector('meta[name="description"]');
        if (desc && v.meta.description) {
          desc.setAttribute("content", v.meta.description);
        }
      },
      { immediate: true },
    );

    // Explicit list per language. The previous version sliced skill groups
    // by position, so reordering a group silently changed these badges.
    const keySkills = computed(() => t.value.keySkills ?? []);

    // Print the light palette whatever the screen is showing. Printing from
    // dark mode painted the page margins dark, because the canvas background
    // follows the root element's colour scheme, not the print stylesheet.
    // "short" is the two-page recruiter cut; everything it drops is still in
    // the DOM, hidden by the print stylesheet, so there is one source of truth.
    // What the cut keeps is data: "short" on a role (bullets kept), on a
    // project or a skill category (false = dropped), and "brief" for the
    // one-liner a project prints instead of its description.
    function downloadPDF(variant) {
      const root = document.documentElement;
      const was = root.getAttribute("data-bs-theme");
      root.setAttribute("data-bs-theme", "light");
      if (variant === "short") root.setAttribute("data-cv", "short");
      const restore = () => {
        if (was) root.setAttribute("data-bs-theme", was);
        root.removeAttribute("data-cv");
        window.removeEventListener("afterprint", restore);
      };
      window.addEventListener("afterprint", restore);
      window.print();
      // Safari and some PDF backends never fire afterprint.
      setTimeout(restore, 1000);
    }

    return { lang, darkMode, t, loading, keySkills, downloadPDF, ICON_MAP };
  },
}).mount("#app");
