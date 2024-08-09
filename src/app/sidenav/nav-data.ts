import { INavbarData } from './helper';

export const navbarData: INavbarData[] = [
  {
    routeLink: 'dashboard',
    icon: 'fas fa-home',
    label: 'Inicio',
  },
  {
    routeLink: 'reserve',
    icon: 'fas fa-clock',
    label: 'Reservas',
    items: [
      {
        routeLink: 'reserve/now',
        label: 'Reservar ahora',
      },
      {
        routeLink: 'reserve/history',
        label: 'Historial',
      },
    ],
  },
  /*{
    routeLink: 'training',
    icon: 'fas fa-dumbbell',
    label: 'Rutina',
  },
  {
    routeLink: 'products',
    icon: 'fas fa-tag',
    label: 'Productos',
  },
  */
  {
    routeLink: 'settings',
    icon: 'fas fa-gear',
    label: 'Gestionar',
  },
];
