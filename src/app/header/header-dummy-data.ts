interface Theme {
  name: string;
  class: string;
  icon: string;
}

interface LoggedUserMenuItems {
  icon: string;
  label: string;
  action: string;
}

interface MenuItems {
  icon: string;
  label: string;
  routeLink?: string;
  action: string;
}

export const themes: Theme[] = [
  {
    name: 'Modo Claro',
    class: 'light-theme',
    icon: 'light',
  },
  {
    name: 'Modo Oscuro',
    class: 'dark-theme',
    icon: 'dark',
  },
];

export const userItems: LoggedUserMenuItems[] = [
  {
    icon: 'fas fa-power-off',
    label: 'Salir',
    action: 'logout',
  },
];

export const redirectLogin: MenuItems[] = [
  {
    icon: 'fas fa-info',
    label: 'Acerca de',
    action: 'about',
  },
  {
    icon: 'fas fa-right-to-bracket',
    label: 'Iniciar Sesion',
    routeLink: 'singIn',
    action: 'login',
  },
];
