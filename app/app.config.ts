export default defineAppConfig({
    docus: {
        locale: 'en', // Default: 'en'
    },
    seo: {
        // Default to `%s - ${site.name}`
        titleTemplate: `MEA - %s`,
        // Default to package.json name
        title: '',
        // Default to package.json description
        description: ''
    },
    // toc: {
    //     // Rename the title of the table of contents
    //     title: 'On this page',
    //     // Add a bottom section to the table of contents
    //     bottom: {
    //         title: 'Community',
    //         links: [{
    //             icon: 'i-lucide-book-open',
    //             label: 'Nuxt UI docs',
    //             to: 'https://ui.nuxt.com/getting-started/installation/nuxt',
    //             target: '_blank'
    //         }]
    //     }
    // },
    header: {
        // Title to display if no logo
        title: 'Manta Academy',
        // Logo configuration
        // logo: {
        //     alt: 'manta-academy-logo',
        //     // Light mode
        //     light: '',
        //     // Dark mode
        //     dark: ''
        // },
    },
    // socials: {
    //     x: 'https://x.com/nuxt_js',
    //     discord: 'https://discord.com/invite/ps2h6QT',
    //     nuxt: 'https://nuxt.com',
    // },
    github: {
        url: 'https://github.com/nuxt-content/docus',
        branch: 'main',
        rootDir: 'docs'
    },
    ui: {
        colors: {
            primary: 'teal', // manta-primary
            secondary: 'red', // manta-secondary
            accent: 'manta-accent'
        }
    }
})