
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserData } from "../CareerMate";
import { Mail, Phone, MapPin, Download, Edit, FileText } from "lucide-react";
import { generateATSOptimizedResumePDF } from "../../utils/atsOptimizedPdfGenerator";

interface ResumePreviewProps {
  userData: UserData;
  onViewCoverLetter: () => void;
  onEditInfo: () => void;
}

const ResumePreview = ({ userData, onViewCoverLetter, onEditInfo }: ResumePreviewProps) => {
  const generateSummary = () => {
    const experience = userData.experience[0];
    const totalYears = userData.experience.length > 0 ? `${userData.experience.length}+ years` : "motivated";
    const skills = userData.skills.technical.slice(0, 3).join(", ");
    
    return `Results-driven ${userData.targetJob.title} with ${totalYears} of experience in ${userData.targetJob.industry}. Proven expertise in ${skills}. Strong track record of delivering high-quality solutions, improving operational efficiency, and driving business growth. Excellent problem-solving abilities with focus on innovation and continuous improvement.`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const handleDownload = () => {
    try {
      generateATSOptimizedResumePDF(userData);
      console.log("ATS-optimized resume downloaded successfully");
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="order-2 lg:order-1">
        <Card className="bg-white shadow-xl border-0 h-fit">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.personalInfo.firstName} {userData.personalInfo.lastName}
              </h1>
              <h2 className="text-xl text-blue-600 font-medium mb-4">
                {userData.targetJob.title}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.personalInfo.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {userData.personalInfo.phone}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userData.personalInfo.location}
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {generateSummary()}
              </p>
            </div>

            {/* Core Competencies */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                CORE COMPETENCIES
              </h3>
              <p className="text-gray-700">
                {[...userData.skills.technical, ...userData.skills.soft].join(" • ")}
              </p>
            </div>

            {/* Experience */}
            {userData.experience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  PROFESSIONAL EXPERIENCE
                </h3>
                
                {userData.experience.map((exp, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{exp.position}</h4>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                    
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                        <li key={achIndex} className="leading-relaxed">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {userData.education.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  EDUCATION
                </h3>
                
                {userData.education.map((edu, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{edu.degree} in {edu.field}</h4>
                        <p className="text-blue-600">{edu.institution}</p>
                        {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                          <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{edu.graduationYear}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Skills */}
            {userData.skills.technical.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  TECHNICAL SKILLS
                </h3>
                <p className="text-gray-700">
                  {userData.skills.technical.join(" • ")}
                </p>
              </div>
            )}

            {userData.skills.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                  LANGUAGES
                </h3>
                <p className="text-gray-700">
                  {userData.skills.languages.join(" • ")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="order-1 lg:order-2">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              ATS-Optimized Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Perfect! I've created a professional, ATS-optimized resume that scores 80%+ on applicant tracking systems. 
              The format includes strategic keyword placement and clean formatting for maximum compatibility.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download ATS Resume PDF
              </Button>
              
              <Button 
                onClick={onViewCoverLetter}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Generate Cover Letter
              </Button>
              
              <Button 
                onClick={onEditInfo}
                variant="outline"
                className="w-full"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Information
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ATS Tips */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">ATS Optimization Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>80%+ ATS Score:</strong> Optimized formatting and keyword placement for maximum compatibility
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Strategic Keywords:</strong> Industry-specific terms and action verbs integrated naturally
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Clean Structure:</strong> Standard sections and formatting that ATS systems can parse easily
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Quantified Results:</strong> Achievement statements optimized with metrics and impact
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumePreview;
