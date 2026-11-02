import { AWSService, Flashcard } from '../types';
import { EXAM_QUESTIONS } from './examQuestions';
import { ARCHITECTURE_PATTERNS } from './architecturePatterns';
import { COMPUTE_SERVICES } from './services/compute';
import { STORAGE_SERVICES } from './services/storage';
import { DATABASE_SERVICES } from './services/database';
import { NETWORKING_SERVICES } from './services/networking';
import { SECURITY_SERVICES } from './services/security';
import { SERVERLESS_SERVICES } from './services/serverless';
import { AIML_SERVICES } from './services/aiml';
import { MANAGEMENT_SERVICES } from './services/management';
import { ANALYTICS_SERVICES } from './services/analytics';
import { DEVTOOLS_SERVICES } from './services/devtools';
import { MIGRATION_SERVICES } from './services/migration';
import { IOT_SERVICES } from './services/iot';
import { BUSINESS_SERVICES } from './services/business';
import { MEDIA_SERVICES } from './services/media';
import { COST_SERVICES } from './services/cost';

export const AWS_SERVICES: AWSService[] = [
  ...COMPUTE_SERVICES,
  ...STORAGE_SERVICES,
  ...DATABASE_SERVICES,
  ...NETWORKING_SERVICES,
  ...SECURITY_SERVICES,
  ...SERVERLESS_SERVICES,
  ...AIML_SERVICES,
  ...MANAGEMENT_SERVICES,
  ...ANALYTICS_SERVICES,
  ...DEVTOOLS_SERVICES,
  ...MIGRATION_SERVICES,
  ...IOT_SERVICES,
  ...BUSINESS_SERVICES,
  ...MEDIA_SERVICES,
  ...COST_SERVICES
];

export const FLASHCARDS: Flashcard[] = EXAM_QUESTIONS;

export { ARCHITECTURE_PATTERNS };
