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
        icon: 'fas fa-dumbbell',
        subject: 'Tu entrenamiento aguarda por ti!',
        description: 'Es importante que asistas a cada reserva que haces, o estarias tomando el puesto de alguien mas',
    },
    {
        icon: 'fas fa-cloud-upload',
        subject: 'No olvides cargar los datos del formulario de ingreso!',
        description: 'Debemos conocer bien tu informacion basica para que hagas parte de esta comuidad',
    },
    /*{
        icon: 'fas fa-trash',
        subject: '350 MB trash files',
        description: 'Lorem ipsum dolor sit amet, consectetuer.',
    }*/
];

export const userItems = [
    {
        icon: 'fas fa-power-off',
        label: 'Salir',
        action: 'logout'
    }
]

export const redirectLogin = [
    {
        icon: 'fas fa-info',
        label: 'Acerca de',
        action: 'about'
    },
    {
        icon: 'fas fa-right-to-bracket',
        label: 'Iniciar Sesion',
        routeLink: 'singIn',
        action:'login'
    }
]