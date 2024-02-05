type EnvironmentType = 'staging' | 'production';

const selectEnv = (): EnvironmentType => {
  const version: {environment: EnvironmentType} = require('../../package.json');
  return version.environment;
};

export const Environment: EnvironmentType = selectEnv();
