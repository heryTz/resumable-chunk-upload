import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Resumable Chunk Upload",
  description: "Easy way to do a resumable upload",
  base: "/resumable-chunk-upload/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Guide", link: "/guide/getting-started" }],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/guide/introduction" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Frontend API", link: "/guide/frontend-api" },
          ],
        },
        {
          text: "Backend",
          items: [
            { text: "Overview", link: "/guide/backend-overview" },
            { text: "Express", link: "/guide/backend-express" },
            { text: "Fastify", link: "/guide/backend-fastify" },
            { text: "NestJS", link: "/guide/backend-nestjs" },
            { text: "Symfony", link: "/guide/backend-symfony" },
            { text: "Laravel", link: "/guide/backend-laravel" },
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

    outline: {
      level: "deep",
    },
  },
});
