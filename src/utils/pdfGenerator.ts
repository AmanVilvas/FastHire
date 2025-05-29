
import jsPDF from 'jspdf';
import { UserData } from '../components/CareerMate';

export const generateResumePDF = (userData: UserData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));
    doc.text(lines, x, y, options);
    return y + (lines.length * 6);
  };

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  yPosition = addText(`${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`, margin, yPosition);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 100, 200);
  yPosition = addText(userData.targetJob.title, margin, yPosition + 5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  yPosition = addText(`${userData.personalInfo.email} | ${userData.personalInfo.phone} | ${userData.personalInfo.location}`, margin, yPosition + 5);
  
  yPosition += 15;

  // Professional Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('PROFESSIONAL SUMMARY', margin, yPosition);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summary = `Experienced ${userData.targetJob.title} with expertise in ${userData.skills.technical.slice(0, 3).join(", ")}. Proven track record of delivering results in ${userData.targetJob.industry} industry.`;
  yPosition = addText(summary, margin, yPosition + 8);
  
  yPosition += 10;

  // Experience
  if (userData.experience.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PROFESSIONAL EXPERIENCE', margin, yPosition);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    yPosition += 8;

    userData.experience.forEach((exp) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(exp.position, margin, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 100, 200);
      yPosition = addText(exp.company, margin, yPosition + 5);
      
      doc.setTextColor(100, 100, 100);
      const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
      };
      const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}`;
      doc.text(dateRange, pageWidth - margin - 50, yPosition - 5);
      
      doc.setTextColor(0, 0, 0);
      yPosition += 5;

      exp.achievements.filter(ach => ach.trim()).forEach((achievement) => {
        yPosition = addText(`• ${achievement}`, margin + 5, yPosition);
        yPosition += 2;
      });
      
      yPosition += 5;
    });
  }

  // Education
  if (userData.education.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('EDUCATION', margin, yPosition);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    yPosition += 8;

    userData.education.forEach((edu) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(`${edu.degree} in ${edu.field}`, margin, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 100, 200);
      yPosition = addText(edu.institution, margin, yPosition + 5);
      
      doc.setTextColor(100, 100, 100);
      doc.text(edu.graduationYear, pageWidth - margin - 30, yPosition - 5);
      
      doc.setTextColor(0, 0, 0);
      yPosition += 10;
    });
  }

  // Skills
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('TECHNICAL SKILLS', margin, yPosition);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(userData.skills.technical.join(' • '), margin, yPosition + 8);
  
  if (userData.skills.soft.length > 0) {
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('CORE COMPETENCIES', margin, yPosition);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(userData.skills.soft.join(' • '), margin, yPosition + 8);
  }

  // Generate filename
  const fileName = `${userData.personalInfo.firstName}_${userData.personalInfo.lastName}_Resume.pdf`;
  
  // Save the PDF
  doc.save(fileName);
};
