const { createApp, ref, computed, onMounted, watch } = Vue;

const FAV = (domain) =>
  `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;

const ICON_MAP = {
  // Backend languages
  PHP: "devicon-php-plain colored",
  Python: "devicon-python-plain colored",
  JavaScript: "devicon-javascript-plain colored",
  Bash: "devicon-bash-plain colored",
  // Backend frameworks
  Symfony: "devicon-symfony-original colored",
  "API Platform": FAV("api-platform.com"),
  Laravel: "devicon-laravel-plain colored",
  CodeIgniter: "devicon-codeigniter-plain colored",
  "Zend Framework 2": FAV("framework.zend.com"),
  Doctrine: FAV("doctrine-project.org"),
  Django: "devicon-django-plain colored",
  // CMS
  WordPress: "devicon-wordpress-plain colored",
  Joomla: "devicon-joomla-plain colored",
  DjangoCMS: FAV("django-cms.org"),
  // E-commerce
  Sylius: FAV("sylius.com"),
  "Magento 2": "devicon-magento-original colored",
  Shopware: "devicon-shopware-original colored",
  OpenCart: FAV("opencart.com"),
  // Databases
  MySQL: "devicon-mysql-plain colored",
  MariaDB: "devicon-mysql-plain colored",
  PerconaDB: FAV("percona.com"),
  SQLite: "devicon-sqlite-plain colored",
  Redis: "devicon-redis-plain colored",
  // Caching & Queuing
  "PSR-6": FAV("php-fig.org"),
  Varnish: FAV("varnish-software.com"),
  RabbitMQ: "devicon-rabbitmq-original colored",
  AMQP: "devicon-rabbitmq-original colored",
  // DevOps
  Docker: "devicon-docker-plain colored",
  "Docker Compose": "devicon-docker-plain colored",
  "Docker Swarm": "devicon-docker-plain colored",
  "GitLab CI": "devicon-gitlab-plain colored",
  "Bash scripting": "devicon-bash-plain colored",
  // Frontend JS
  jQuery: "devicon-jquery-plain colored",
  "Vue.js": "devicon-vuejs-plain colored",
  React: "devicon-react-plain colored",
  "Alpine.js": "devicon-alpinejs-original colored",
  "@hotwired/Stimulus": FAV("stimulus.hotwired.dev"),
  "@hotwired/Turbo": FAV("turbo.hotwired.dev"),
  KnockoutJS: FAV("knockoutjs.com"),
  // CSS / Build
  SCSS: "devicon-sass-original colored",
  "Bootstrap 5": "devicon-bootstrap-plain colored",
  "Semantic UI": FAV("semantic-ui.com"),
  Bulma: FAV("bulma.io"),
  webpack: "devicon-webpack-plain colored",
  yarn: "devicon-yarn-plain colored",
  // AI
  "GitHub Copilot (Codex)": "devicon-github-original colored",
  "Anthropic Claude": FAV("anthropic.com"),
};

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
          fetch("translations/en.json").then((r) => r.json()),
          fetch("translations/bg.json").then((r) => r.json()),
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

    const keySkills = computed(() => {
      const s = t.value.skills;
      if (!s) return [];
      return [
        ...(s.backend?.groups[0]?.items ?? []).slice(0, 4),
        ...(s.backend?.groups[1]?.items ?? []).slice(0, 3),
        ...(s.frontend?.groups[0]?.items ?? []).slice(0, 3),
        ...(s.devops?.groups[0]?.items ?? []).slice(0, 2),
        ...(s.ai?.groups[0]?.items ?? []),
      ];
    });

    function downloadPDF() {
      const el = document.getElementById("cv-content");
      const filename = `Ivan_Kakurov_CV_${lang.value.toUpperCase()}.pdf`;
      html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            onclone(clonedDoc) {
              clonedDoc.documentElement.setAttribute("data-bs-theme", "light");
              clonedDoc
                .querySelectorAll(".print-hidden")
                .forEach((el) => (el.style.display = "none"));
            },
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css"] },
        })
        .from(el)
        .save();
    }

    return { lang, darkMode, t, loading, keySkills, downloadPDF, ICON_MAP };
  },
}).mount("#app");
