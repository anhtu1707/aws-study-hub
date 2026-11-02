export type AWSCategory =
  | 'compute'
  | 'storage'
  | 'database'
  | 'networking'
  | 'security'
  | 'serverless'
  | 'aiml'
  | 'management'
  | 'analytics'
  | 'devtools'
  | 'migration'
  | 'iot'
  | 'business'
  | 'media'
  | 'cost';

export type ExamLevel = 'CLF' | 'SAA' | 'DVA' | 'SOA' | 'SAP' | 'MLS' | 'ANS' | 'DBS' | 'DAS' | 'SCS';

export type LearningStatus = 'not_started' | 'in_progress' | 'mastered';

export interface DockerLabConfig {
  profile: string;
  command: string;
  stopCommand: string;
  endpoint: string;
  guiUrl?: string;
  description: string;
}

export interface HandsOnGuide {
  title: string;
  objective: string;
  consoleSteps: string[];
  cliSteps: string[];
  verification: string;
  cleanup?: string;
}

export interface AWSService {
  id: string;
  code: string;
  name: string;
  category: AWSCategory;
  categoryLabel: string;
  levels: ExamLevel[];
  summary: string;
  fullDescription: string;
  whenToChoose: string;
  examTip: string;
  pricingGotcha: string;
  cliSnippet: string;
  relatedServices: string[];
  freeTier: boolean;
  dockerLab?: DockerLabConfig;
  handsOn?: HandsOnGuide;
}

export interface Flashcard {
  id: string;
  scenario: string;
  question: string;
  answer: string;
  explanation: string;
  serviceId: string;
  examCode: string;
}

export interface ArchitecturePattern {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  services: string[];
}
