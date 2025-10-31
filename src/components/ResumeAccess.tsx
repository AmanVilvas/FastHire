import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export const ResumeAccess = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (accessCode === 'FAST-HIRE-2024') {
        setHasAccess(true);
        toast.success('Access granted!');
      } else {
        toast.error('Invalid access code');
      }
    } catch (error) {
      toast.error('Error verifying access code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    setShowDialog(true);
  };

  const handleSupportAndDownload = () => {
    setShowDialog(false);
    window.open('https://buy.stripe.com/test_00g3eQ2wA2wQ0yQeUU', '_blank');
  };

  const handleJustDownload = () => {
    setShowDialog(false);
    window.open('/resume.pdf', '_blank');
  };

  if (hasAccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Resume Access</CardTitle>
          <CardDescription>You have access to view and download the resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Resume Preview</h3>
              <p className="text-sm text-gray-500">Resume content will be displayed here...</p>
            </div>
            <Button 
              onClick={handleDownloadClick}
              className="w-full"
            >
              Download Resume
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Support FastHire?</DialogTitle>
                </DialogHeader>
                <p>Would you like to support us with a small payment before downloading?</p>
                <DialogFooter>
                  <Button onClick={handleSupportAndDownload}>Support & Download</Button>
                  <Button variant="outline" onClick={handleJustDownload}>Just Download</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Resume Access</CardTitle>
        <CardDescription>
          Enter the access code to view and download the resume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Access Resume'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 