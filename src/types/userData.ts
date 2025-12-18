export interface UserData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
  };
  targetJob: {
    title: string;
    company: string;
    industry: string;
    description: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string; // yyyy-mm (for <input type="month" />)
    endDate: string; // yyyy-mm (for <input type="month" />)
    current: boolean;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  summary: string;
}

export const initialUserData: UserData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
  },
  targetJob: {
    title: "",
    company: "",
    industry: "",
    description: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  summary: "",
};

