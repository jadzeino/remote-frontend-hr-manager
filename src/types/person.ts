export type Person = {
  id: number;
  name: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  employment: string;
  status: 'onboarding' | 'active' | 'offboarded';
  photo: string;
};
