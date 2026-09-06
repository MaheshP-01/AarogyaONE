/**
 * User roles supported across the RuralCare Connect platform
 */
export type UserRole = 'health-worker' | 'doctor' | 'patient';

/**
 * Supported regional and national languages for Maharashtra rural healthcare
 */
export type LanguageCode = 'en' | 'mr' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
}

/**
 * Standard health check response format
 */
export interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  timestamp?: string;
}

/**
 * Role Card UI definition
 */
export interface RoleCardItem {
  id: UserRole;
  title: string;
  roleName: string;
  subtitle: string;
  description: string;
  path: string;
  features: string[];
}
