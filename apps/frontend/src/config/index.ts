interface AppConfig {
  api: {
    baseUrl: string
  }
  app: {
    name: string
  }
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value || defaultValue!
}

export const config: AppConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080'),
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Todo App'),
  },
}

if (import.meta.env.DEV) {
  console.log('🔧 App Configuration:', {
    apiBaseUrl: config.api.baseUrl,
    appName: config.app.name,
  })
}
