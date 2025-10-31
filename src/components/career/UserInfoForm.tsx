import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { UserData } from "../CareerMate";

interface UserInfoFormProps {
  initialData: UserData;
  onComplete: (data: UserData) => void;
  initialPrompt: string;
}

const UserInfoForm = ({ initialData, onComplete, initialPrompt }: UserInfoFormProps) => {
  const [formData, setFormData] = useState<UserData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        achievements: [""]
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addAchievement = (expIndex: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? { ...exp, achievements: [...exp.achievements, ""] } : exp
      )
    }));
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          achievements: exp.achievements.map((ach, j) => j === achIndex ? value : ach)
        } : exp
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: "",
        degree: "",
        field: "",
        graduationYear: "",
        gpa: ""
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = (category: keyof typeof formData.skills, skill: string) => {
    if (skill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category: keyof typeof formData.skills, index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-gray-900">
            Let's build your profile
          </CardTitle>
          <p className="text-gray-600">
            Tell me about yourself and the position you're targeting
          </p>
          {initialPrompt && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">{initialPrompt}</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="target">Job</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.personalInfo.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.personalInfo.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={formData.personalInfo.location}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkedIn">LinkedIn URL (optional)</Label>
                  <Input
                    id="linkedIn"
                    value={formData.personalInfo.linkedIn}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedIn: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="target" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    value={formData.targetJob.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetJob: { ...prev.targetJob, title: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Target Company (optional)</Label>
                  <Input
                    id="company"
                    value={formData.targetJob.company}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetJob: { ...prev.targetJob, company: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={formData.targetJob.industry}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetJob: { ...prev.targetJob, industry: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="jobDescription">Job Description (paste key requirements)</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description or key requirements here to help me tailor your resume..."
                    className="min-h-32"
                    value={formData.targetJob.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      targetJob: { ...prev.targetJob, description: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Button type="button" onClick={addExperience} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              
              {formData.experience.map((exp, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Experience #{index + 1}</h4>
                    {formData.experience.length > 0 && (
                      <Button 
                        type="button" 
                        onClick={() => removeExperience(index)}
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>End Date {!exp.current && "*"}</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        disabled={exp.current}
                        required={!exp.current}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, "current", e.target.checked)}
                          className="mr-2"
                        />
                        <Label htmlFor={`current-${index}`} className="text-sm">Current position</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Key Achievements</Label>
                      <Button 
                        type="button" 
                        onClick={() => addAchievement(index)}
                        variant="outline" 
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex gap-2 mb-2">
                        <Textarea
                          placeholder="Describe a specific achievement with numbers/results when possible..."
                          value={achievement}
                          onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                          className="flex-1"
                          rows={2}
                        />
                        {exp.achievements.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newAchievements = exp.achievements.filter((_, i) => i !== achIndex);
                              updateExperience(index, "achievements", newAchievements);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              
              {formData.experience.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No experience added yet. Click "Add Experience" to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Education</h3>
                <Button type="button" onClick={addEducation} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              
              {formData.education.map((edu, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Education #{index + 1}</h4>
                    {formData.education.length > 0 && (
                      <Button 
                        type="button" 
                        onClick={() => removeEducation(index)}
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Institution *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Degree *</Label>
                      <Input
                        placeholder="e.g., Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Field of Study *</Label>
                      <Input
                        placeholder="e.g., Computer Science"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>Graduation Year *</Label>
                      <Input
                        placeholder="2024"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </Card>
              ))}
              
              {formData.education.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-6">
                {/* Technical Skills */}
                <div>
                  <Label>Technical Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.technical.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill("technical", index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a technical skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill("technical", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Soft Skills */}
                <div>
                  <Label>Soft Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.soft.map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill("soft", index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a soft skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill("soft", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.languages.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill("languages", index)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a language and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill("languages", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate My Resume <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default UserInfoForm;
