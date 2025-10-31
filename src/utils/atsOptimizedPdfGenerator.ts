
import jsPDF from 'jspdf';
import { UserData } from '../components/CareerMate';

export const generateATSOptimizedResumePDF = (userData: UserData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 25;

  doc.setFont('helvetica', 'normal');

  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
    doc.text(lines, x, y, options);
    return y + (lines.length * 5) + 3;
  };
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const fullName = `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`;
  yPosition = addText(fullName, margin, yPosition);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const contactInfo = `${userData.personalInfo.email} | ${userData.personalInfo.phone} | ${userData.personalInfo.location}`;
  yPosition = addText(contactInfo, margin, yPosition);
  
  if (userData.personalInfo.linkedIn || userData.personalInfo.portfolio) {
    let additionalInfo = '';
    if (userData.personalInfo.linkedIn) additionalInfo += `LinkedIn: ${userData.personalInfo.linkedIn}`;
    if (userData.personalInfo.portfolio) {
      if (additionalInfo) additionalInfo += ' | ';
      additionalInfo += `Portfolio: ${userData.personalInfo.portfolio}`;
    }
    yPosition = addText(additionalInfo, margin, yPosition);
  }
  
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('PROFESSIONAL SUMMARY', margin, yPosition);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const optimizedSummary = generateATSOptimizedSummary(userData);
  yPosition = addText(optimizedSummary, margin, yPosition);
  
  yPosition += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('CORE COMPETENCIES', margin, yPosition);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const allSkills = [...userData.skills.technical, ...userData.skills.soft];
  const skillsText = allSkills.join(' • ');
  yPosition = addText(skillsText, margin, yPosition);
  
  yPosition += 6;
  if (userData.experience.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PROFESSIONAL EXPERIENCE', margin, yPosition);

    userData.experience.forEach((exp) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(exp.position, margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      const companyLine = `${exp.company} | ${formatDateRange(exp.startDate, exp.endDate, exp.current)}`;
      yPosition = addText(companyLine, margin, yPosition);
      
      yPosition += 2;
      exp.achievements.filter(ach => ach.trim()).forEach((achievement) => {
        const optimizedAchievement = optimizeAchievementForATS(achievement, userData.targetJob.title);
        yPosition = addText(`• ${optimizedAchievement}`, margin + 3, yPosition);
      });
      
      yPosition += 4;
    });
  }
  if (userData.education.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('EDUCATION', margin, yPosition);

    userData.education.forEach((edu) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${edu.degree} in ${edu.field}`, margin, yPosition);
      
      doc.setFont('helvetica', 'normal');
      const eduLine = `${edu.institution} | ${edu.graduationYear}`;
      yPosition = addText(eduLine, margin, yPosition);
      
      if (edu.gpa && parseFloat(edu.gpa) >= 3.5) {
        yPosition = addText(`GPA: ${edu.gpa}`, margin, yPosition);
      }
      
      yPosition += 3;
    });
  }
  if (userData.skills.technical.length > 0) {
    yPosition += 3;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('TECHNICAL SKILLS', margin, yPosition);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(userData.skills.technical.join(' • '), margin, yPosition);
  }
  if (userData.skills.languages.length > 0) {
    yPosition += 3;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('LANGUAGES', margin, yPosition);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(userData.skills.languages.join(' • '), margin, yPosition);
  }

  const fileName = `${userData.personalInfo.firstName}_${userData.personalInfo.lastName}_Resume_ATS.pdf`;
  doc.save(fileName);
};

const generateATSOptimizedSummary = (userData: UserData): string => {
  const jobTitle = userData.targetJob.title;
  const industry = userData.targetJob.industry;
  const yearsExp = userData.experience.length > 0 ? `${userData.experience.length}+ years` : "experienced";
  const topSkills = userData.skills.technical.slice(0, 4).join(", ");
  
  return `Results-driven ${jobTitle} with ${yearsExp} of experience in ${industry}. Proven expertise in ${topSkills}. Strong track record of delivering high-quality solutions, improving operational efficiency, and driving business growth. Excellent problem-solving abilities with focus on innovation and continuous improvement.`;
};

const optimizeAchievementForATS = (achievement: string, targetRole: string): string => {
  const actionVerbs = ["Developed", "Implemented", "Improved", "Increased", "Reduced", "Led", "Managed", "Created", "Optimized", "Delivered"];
  
  if (!actionVerbs.some(verb => achievement.toLowerCase().includes(verb.toLowerCase()))) {
    return `Delivered ${achievement.toLowerCase()}`;
  }
  
  return achievement;
};

const formatDateRange = (startDate: string, endDate: string, current: boolean): string => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };
  
  return `${formatDate(startDate)} - ${current ? "Present" : formatDate(endDate)}`;
};
