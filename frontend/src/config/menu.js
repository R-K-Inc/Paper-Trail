import {
    CircleAlert,
    Files,
    Gauge,
} from 'lucide-react'

export const mainMenu = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Gauge
    },
    {
        title: 'Pages',
        url: '/pages',
        icon: Files,
        items: [
            {
                title: 'Sample Page',
                url: '/pages/sample',
            },
            {
                title: 'Coming Soon',
                url: '/pages/feature',
            },
        ]
    },
    {
        title: 'Error',
        url: '/404',
        icon: CircleAlert,
    },
]