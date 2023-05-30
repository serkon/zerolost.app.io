import { PageNotFound } from 'src/components/http/not-found.page';

export interface RouteItems {
  path: string;
  title: string;
  icon: string;
  children?: RouteItems[];
}

export const RouteList = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: PageNotFound,
    icon: 'ti-dashboard',
  },
  {
    path: '/storage',
    title: 'Storage',
    component: PageNotFound,
    icon: 'ti-folder',
    children: [
      {
        path: '/overview',
        title: 'Overview',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Getting Started',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Installation',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
  {
    path: '/host',
    title: 'Host',
    component: PageNotFound,
    icon: 'ti-ghost',
  },
  {
    path: '/instance',
    title: 'Instance',
    component: PageNotFound,
    icon: 'ti-git-merge',
  },
  {
    path: '/compliance',
    title: 'Compliance',
    component: PageNotFound,
    icon: 'ti-ship',
    children: [
      {
        path: '/overview',
        title: 'Overview',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Defination',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Discovery',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Action',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
  {
    path: '/protection',
    title: 'Protection',
    component: PageNotFound,
    icon: 'ti-shield-check',
    children: [
      {
        path: '/overview',
        title: 'Overview',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Anomaly',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Action',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
  {
    path: '/runbook',
    title: 'Runbook',
    component: PageNotFound,
    icon: 'ti-run',
    children: [
      {
        path: '/overview',
        title: 'Disaster Recovery',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Clone Management',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Workflow',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Templates',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
  {
    path: '/cloud',
    title: 'Cloud',
    component: PageNotFound,
    icon: 'ti-cloud',
  },
  {
    path: '/history',
    title: 'History',
    component: PageNotFound,
    icon: 'ti-history',
    children: [
      {
        path: '/overview',
        title: 'Jobs',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Alert',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
  {
    path: '/management',
    title: 'Management',
    component: PageNotFound,
    icon: 'ti-settings',
    children: [
      {
        path: '/overview',
        title: 'Users',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/getting-started',
        title: 'Roles',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Groups',
        component: PageNotFound,
        icon: 'ti-point',
      },
      {
        path: '/installation',
        title: 'Metrics',
        component: PageNotFound,
        icon: 'ti-point',
      },
    ],
  },
];
