type AppConfigType = {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfigType = {
    name: import.meta.env.VITE_APP_NAME ?? "Paper Trail",
    github: {
        title: "Paper Trail",
        url: "https://github.com/R-K-Inc/Paper-Trail",
    },
    author: {
        name: "Rasheem & Kofi",
        url: "https://github.com/",
    }
}

export const baseUrl = import.meta.env.VITE_BASE_URL ?? ""
