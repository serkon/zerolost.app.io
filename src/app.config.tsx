export const AppConfig = {
  paging: {
    size: 8,
  },
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
        min: 200,
      },
      version: {
        lessThan: 2,
      },
    },
  },
  profile: {
    dangerZone: true,
    transfere: true,
    delete: true,
  },
  notification: {
    timeout: 4000,
  },
};
