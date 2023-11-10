export const themes = [
    {
        name: 'Modo Claro',
        class: 'light-theme',
        icon: 'light'
    },
    {
        name: 'Modo Oscuro',
        class: 'dark-theme',
        icon: 'dark'
    }
];

export const notifications = [
    {
        icon: 'fas fa-cloud-download',
        subject: 'Download complete',
        description: 'Lorem ipsum dolor sit amet, consectetuer.',
    },
    {
        icon: 'fas fa-cloud-upload',
        subject: 'Upload complete',
        description: 'Lorem ipsum dolor sit amet, consectetuer.',
    },
    {
        icon: 'fas fa-trash',
        subject: '350 MB trash files',
        description: 'Lorem ipsum dolor sit amet, consectetuer.',
    }
];

export const userItems = [
    {
        icon: 'fas fa-user',
        label: 'Perfil',
        routeLink: 'profile'
    }, 
    {
        icon: 'fas fa-wrench',
        label: 'Info',
        routeLink: 'ajustes'
    },
    {
        icon: 'fas fa-power-off',
        label: 'Salir',
        //routeLink: 'signOut',
        action: 'logout'
    }
]

export const redirectLogin = [
    {
        icon: 'fas fa-right-to-bracket',
        label: 'Iniciar Sesion',
        routeLink: 'singIn'
    }
]