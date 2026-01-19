import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Download, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useUserXP } from "@/hooks/useUserXP";

interface CertificateStepProps {
  fullName: string;
  certificateId: string;
  completionDate: string;
  onNext: () => void;
}

export function CertificateStep({
  fullName,
  certificateId,
  completionDate,
  onNext,
}: CertificateStepProps) {
  const [confettiFired, setConfettiFired] = useState(false);
  const { awardXP } = useUserXP();

  useEffect(() => {
    if (!confettiFired) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#4A90E2", "#F5A623", "#6DD5FA", "#43B581"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#4A90E2", "#F5A623", "#6DD5FA", "#43B581"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
      setConfettiFired(true);
    }
  }, [confettiFired]);

  const handleDownloadCertificate = async () => {
    // Convert logo to base64 for embedding
    const logoUrl = '/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png';
    let logoBase64 = '';
    
    try {
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      logoBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load logo:', error);
    }
    
    // Create a simple certificate HTML for PDF generation
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 60px;
            text-align: center;
            background: linear-gradient(to bottom right, #ffffff, #f0f9ff);
          }
          .certificate {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px;
            border: 3px solid #4A90E2;
            background: white;
          }
          .logo { height: 80px; margin-bottom: 30px; }
          .title { color: #4A90E2; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
          .divider { height: 4px; width: 120px; background: linear-gradient(to right, #4A90E2, #F5A623); margin: 20px auto; }
          .awarded { font-size: 20px; margin: 30px 0 10px; }
          .name { font-size: 48px; font-weight: bold; margin: 20px 0; font-family: 'Georgia', serif; }
          .description { color: #666; margin: 30px auto; max-width: 600px; line-height: 1.6; }
          .footer { display: flex; justify-content: space-between; margin-top: 50px; font-size: 14px; color: #666; }
          .quote { font-style: italic; color: #888; margin-top: 40px; padding-top: 30px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="certificate">
          ${logoBase64 ? `<img src="${logoBase64}" alt="PromptAndGo Logo" class="logo" />` : '<div style="height: 80px; margin-bottom: 30px;"></div>'}
          <div class="title">PromptAndGo Certified Prompt Master</div>
          <div class="divider"></div>
          <div class="awarded">Awarded to</div>
          <div class="name">${fullName}</div>
          <div class="description">
            In recognition of successfully completing the Prompt Like a Pro onboarding and demonstrating 
            creative excellence in AI prompt writing.
          </div>
          <div class="footer">
            <div>
              <strong>Date</strong><br/>
              ${completionDate}
            </div>
            <div>
              <strong>Certificate ID</strong><br/>
              ${certificateId}
            </div>
          </div>
          <div class="quote">"Get better prompts and faster results with www.promptandgo.ai"</div>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PromptAndGo-Certificate-${certificateId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Certificate downloaded! Open the HTML file and use your browser's print function to save as PDF.");
  };

  const shareText = `🎓 Just earned my PromptAndGo Certified Prompt Master certification!

I completed the Prompt Like a Pro course and I'm now crafting smarter AI prompts that actually work.

Ready to level up your AI game? Start here 👉 https://promptandgo.ai

#AI #Prompting #Certification #ChatGPT #AIProductivity`;

  const handleShareLinkedIn = () => {
    // Copy share text to clipboard automatically
    navigator.clipboard.writeText(shareText);
    
    // Award XP for LinkedIn share
    awardXP({
      activityKey: 'linkedin_share',
      description: 'Shared certificate on LinkedIn',
    });
    
    // Open LinkedIn post composer (not share-offsite) so user can paste text and add certificate image
    window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank");
    
    toast.success(
      "Post text copied! Paste it in LinkedIn and attach your downloaded certificate as an image for best results.",
      { duration: 6000 }
    );
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(shareText);
    toast.success("Share text copied to clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8 animate-scale-in">
        <div className="relative inline-block">
          <Award className="h-32 w-32 text-[#F5A623] mx-auto mb-4" />
          <Sparkles className="h-8 w-8 text-[#6DD5FA] absolute top-0 right-0 animate-pulse" />
        </div>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4A90E2] to-[#43B581] bg-clip-text text-transparent">
        You're Officially a PromptAndGo Certified Prompt Master!
      </h2>

      <p className="text-xl text-muted-foreground mb-8">
        Congratulations! You've completed the Prompt Like a Pro onboarding and earned your certification.
      </p>

      {/* Certificate Preview */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-white to-[#4A90E2]/5 border-[#F5A623]/20 border-2">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png" 
              alt="PromptAndGo Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-[#4A90E2] mb-2">
              PromptAndGo Certified Prompt Master
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-[#4A90E2] to-[#F5A623] mx-auto" />
          </div>

          <p className="text-lg mb-4">Awarded to</p>
          <p className="text-3xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {fullName}
          </p>

          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            In recognition of successfully completing the Prompt Like a Pro onboarding and demonstrating creative excellence in AI prompt writing.
          </p>

          <div className="flex justify-between items-end text-sm text-muted-foreground">
            <div>
              <p className="font-semibold">Date</p>
              <p>{completionDate}</p>
            </div>
            <div>
              <p className="font-semibold">Certificate ID</p>
              <p className="font-mono">{certificateId}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm italic text-muted-foreground">
              "Get better prompts and faster results with www.promptandgo.ai"
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button
          onClick={handleDownloadCertificate}
          size="lg"
          className="bg-[#4A90E2] hover:bg-[#4A90E2]/90"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Certificate (HTML)
        </Button>
        <Button
          onClick={handleShareLinkedIn}
          size="lg"
          variant="outline"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share on LinkedIn
        </Button>
      </div>

      <Button onClick={handleCopyShareText} variant="ghost" size="sm">
        Copy LinkedIn Post Text
      </Button>

      <div className="mt-12">
        <Button onClick={onNext} size="lg" variant="outline">
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
}
