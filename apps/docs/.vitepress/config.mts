import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Resumable Upload",
  description: "Easy way to do a resumable upload",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Guide", link: "/guide" }],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide!introduction" },
            { text: "Getting Started", link: "/guide" },
          ],
        },
        {
          text: "Frontend",
          items: [{ text: "API", link: "/guide/frontend-api" }],
        },
        {
          text: "Backend",
          items: [
            { text: "Overview", link: "/guide/backend-overview" },
            { text: "Expressjs", link: "/guide/backend-express" },
            { text: "From scratch", link: "/guide/backend-from-scratch" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/heryTz/resumable-chunk-upload",
      },
    ],
  },
});
