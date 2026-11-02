export type AWSCategory =
  | 'compute'
  | 'storage'
  | 'database'
  | 'networking'
  | 'security'
  | 'serverless'
  | 'containers'
  | 'aiml'
  | 'management'
  | 'analytics'
  | 'devtools'
  | 'migration'
  | 'cost';

export type ExamLevel = 'CLF' | 'SAA' | 'DVA' | 'SOA' | 'SAP' | 'MLS' | 'ANS';

export type LearningStatus = 'not_started' | 'in_progress' | 'mastered';

export interface DockerLabConfig {
  profile: string;
  command: string;
  stopCommand: string;
  endpoint: string;
  guiUrl?: string;
  description: string;
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
