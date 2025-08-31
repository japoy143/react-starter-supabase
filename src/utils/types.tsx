export type ArticleType = {
  id: string;
  title: string;
  description: string;
  date: string;
  created_at: string;
  image_url: string;
};

export type MedicalEquipmentType = {
  id: number;
  name: string;
  description: string;
  image_url: string;
};

export type SpecialistType = {
  id: number;
  specialization: string;
  image_url: string;
};

export type NewsType = {
  id: string;
  news_title: string;
  news_date: string;
};

export type AppointmentType = {
  id: string;
  nickname: string;
  phone_number: string;
  waiting_number: string;
  status: boolean;
};
