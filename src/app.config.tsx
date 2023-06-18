export const AppConfig = {
  storage: {
    thresholds: {
      warning: 80,
      danger: 90,
    },
    form: {
      password: {
        min: 6,
        max: 12,
      },
      port: {
        min: 1000,
      },
    },
  },
  profile: {
    dangerZone: true,
    transfere: true,
    delete: true,
  },
  notification: {
    timeout: 2000,
  },
};
