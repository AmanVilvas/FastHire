
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserData } from "../CareerMate";
import { Download, Edit, ArrowLeft, Mail } from "lucide-react";

interface CoverLetterPreviewProps {
  userData: UserData;
  onBackToResume: () => void;
  onEditInfo: () => void;
}

const CoverLetterPreview = ({ userData, onBackToResume, onEditInfo }: CoverLetterPreviewProps) => {
  const generateCoverLetter = () => {
    const { personalInfo, targetJob, experience, skills, education } = userData;
    const currentDate = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    
    const relevantExp = experience[0];
    const topSkills = skills.technical.slice(0, 3);
    const degree = education[0];

    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetJob.title} position${targetJob.company ? ` at ${targetJob.company}` : ''}. With my background in ${degree?.field || targetJob.industry} and hands-on experience in ${topSkills.join(", ")}, I am excited about the opportunity to contribute to your team's success.

${relevantExp ? `In my current role as ${relevantExp.position} at ${relevantExp.company}, I have developed strong expertise in areas directly relevant to this position. ${relevantExp.achievements.filter(ach => ach.trim())[0] || 'I have consistently delivered results that drive business value and improve operational efficiency.'}` : `Through my educational background and project experience, I have developed a strong foundation in ${topSkills.join(" and ")}, which aligns perfectly with the requirements for this role.`}

What particularly excites me about this opportunity is the chance to work in the ${targetJob.industry} industry, where I can apply my skills in ${topSkills.slice(0, 2).join(" and ")} to help drive innovation and growth. My experience has taught me the importance of ${skills.soft.slice(0, 2).join(" and ") || "collaboration, problem-solving, and continuous learning"}, qualities that I believe are essential for success in this role.

${targetJob.description ? 'Based on the job requirements you\'ve outlined, I am confident that my technical expertise and proven track record make me an ideal candidate for this position.' : 'I am particularly drawn to roles that challenge me to grow professionally while contributing meaningful value to the organization.'}

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's continued success. Thank you for considering my application, and I look forward to hearing from you soon.

Sincerely,
${personalInfo.firstName} ${personalInfo.lastName}`;
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading cover letter...");
  };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
      {/* Preview */}
      <div className="order-2 lg:order-1">
        <Card className="bg-white shadow-xl border-0 h-fit">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-right mb-8">
              <p className="text-gray-600">{new Date().toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}</p>
            </div>

            {/* Sender Info */}
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {userData.personalInfo.firstName} {userData.personalInfo.lastName}
              </h1>
              <p className="text-gray-600">{userData.personalInfo.email}</p>
              <p className="text-gray-600">{userData.personalInfo.phone}</p>
              <p className="text-gray-600">{userData.personalInfo.location}</p>
            </div>

            {/* Recipient */}
            {userData.targetJob.company && (
              <div className="mb-8">
                <p className="text-gray-900 font-medium">Hiring Manager</p>
                <p className="text-gray-900">{userData.targetJob.company}</p>
              </div>
            )}

            {/* Letter Content */}
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {generateCoverLetter()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="order-1 lg:order-2">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600" />
              Your Personalized Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Perfect! I've crafted a personalized cover letter that tells your unique story and 
              connects your experience with the role you're targeting. The tone is professional 
              yet engaging, and it highlights your key qualifications.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Cover Letter
              </Button>
              
              <Button 
                onClick={onBackToResume}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resume
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

        {/* Tips */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Cover Letter Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Personalized Opening:</strong> Addresses the specific role and company
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Relevant Experience:</strong> Highlights your most applicable skills and achievements
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Natural Tone:</strong> Professional yet conversational, avoiding generic phrases
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                <strong>Clear Value Proposition:</strong> Shows how you'll contribute to their success
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
