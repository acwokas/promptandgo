import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Download, Linkedin, Share2, Sparkles, Copy, CheckCircle2 } from "lucide-react";
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
  const [copiedId, setCopiedId] = useState(false);
  const { awardXP } = useUserXP();

  useEffect(() => {
    if (!confettiFired) {
      // Fire confetti with brand colors - converting to hex for confetti library
      const duration = 4000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors: ["hsl(350, 78%, 59%)", "hsl(174, 82%, 33%)", "hsl(49, 91%, 78%)", "hsl(25, 95%, 53%)"],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 1 },
          colors: ["hsl(350, 78%, 59%)", "hsl(174, 82%, 33%)", "hsl(49, 91%, 78%)", "hsl(25, 95%, 53%)"],
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

    // Create a premium certificate HTML for PDF generation with brand colors
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Georgia', 'Playfair Display', serif;
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, hsl(28 76% 97%) 0%, hsl(28 76% 94%) 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate-container {
            max-width: 900px;
            width: 100%;
            padding: 80px;
            background: white;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            border: 2px solid hsl(350, 78%, 59%);
            border-radius: 12px;
            position: relative;
            overflow: hidden;
          }
          .certificate-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, hsl(350, 78%, 59%), hsl(174, 82%, 33%));
          }
          .logo { height: 90px; margin-bottom: 40px; display: block; }
          .seal {
            display: inline-block;
            width: 120px;
            height: 120px;
            border: 3px solid hsl(350, 78%, 59%);
            border-radius: 50%;
            background: linear-gradient(135deg, hsl(350, 78%, 95%), hsl(350, 78%, 90%));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 50px;
            margin: 30px 0;
            position: relative;
          }
          .seal::before {
            content: '';
            position: absolute;
            inset: -8px;
            border: 2px dashed hsl(350, 78%, 59%);
            border-radius: 50%;
            opacity: 0.5;
          }
          .title {
            color: hsl(350, 78%, 59%);
            font-size: 42px;
            font-weight: 700;
            margin: 20px 0;
            letter-spacing: -1px;
          }
          .subtitle {
            color: hsl(174, 82%, 33%);
            font-size: 18px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 40px;
          }
          .divider {
            height: 3px;
            width: 150px;
            background: linear-gradient(90deg, hsl(350, 78%, 59%), hsl(174, 82%, 33%), hsl(350, 78%, 59%));
            margin: 30px auto;
          }
          .awarded {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: hsl(240, 28%, 14%);
            margin: 30px 0 10px;
          }
          .name {
            font-size: 56px;
            font-weight: 700;
            margin: 20px 0 30px;
            color: hsl(350, 78%, 59%);
            font-family: 'Playfair Display', serif;
          }
          .description {
            color: hsl(240, 10%, 46%);
            margin: 30px auto;
            max-width: 700px;
            line-height: 1.8;
            font-size: 16px;
            font-style: italic;
          }
          .credentials {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            gap: 40px;
            padding-top: 40px;
            border-top: 2px solid hsl(28, 18%, 89%);
          }
          .credential {
            flex: 1;
            text-align: center;
          }
          .credential-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: hsl(240, 28%, 14%);
            margin-bottom: 8px;
          }
          .credential-value {
            font-size: 18px;
            color: hsl(350, 78%, 59%);
            font-weight: 600;
            font-family: 'Courier New', monospace;
          }
          .quote {
            font-style: italic;
            color: hsl(240, 10%, 46%);
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid hsl(28, 18%, 89%);
            font-size: 14px;
          }
          .verification {
            margin-top: 40px;
            padding: 15px;
            background: hsl(174, 82%, 95%);
            border-left: 4px solid hsl(174, 82%, 33%);
            text-align: left;
            font-size: 12px;
            color: hsl(240, 28%, 14%);
            font-family: 'Courier New', monospace;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          ${logoBase64 ? `<img src="${logoBase64}" alt="PromptAndGo Logo" class="logo" />` : ''}
          <div class="seal">🏆</div>
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">Prompt Like a Pro</div>
          <div class="divider"></div>
          <div class="awarded">Presented to</div>
          <div class="name">${fullName}</div>
          <div class="description">
            This certificate recognizes successful completion of the PromptAndGo Prompt Like a Pro certification program. The holder has demonstrated mastery in AI prompt engineering and earned the distinction of PromptAndGo Certified Professional.
          </div>
          <div class="credentials">
            <div class="credential">
              <div class="credential-label">Completion Date</div>
              <div class="credential-value">${completionDate}</div>
            </div>
            <div class="credential">
              <div class="credential-label">Certificate ID</div>
              <div class="credential-value">${certificateId}</div>
            </div>
            <div class="credential">
              <div class="credential-label">Status</div>
              <div class="credential-value" style="color: hsl(174, 82%, 33%);">Verified</div>
            </div>
          </div>
          <div class="quote">"Master prompt engineering, shape the future of AI." — PromptAndGo</div>
          <div class="verification">
            Verify this certificate: https://promptandgo.ai/verify/${certificateId}
          </div>
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

  // Parse completion date to get year and month
  const getDateParts = () => {
    try {
      const date = new Date(completionDate);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1 // LinkedIn uses 1-indexed months
      };
    } catch {
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
  };

  const handleAddToLinkedIn = () => {
    const { year, month } = getDateParts();
    
    // Build LinkedIn Add to Profile URL for certifications
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: 'PromptAndGo Certified Prompt Master',
      organizationName: 'PromptAndGo',
      issueYear: year.toString(),
      issueMonth: month.toString(),
      certId: certificateId,
      certUrl: `https://promptandgo.ai/certification`
    });
    
    const linkedInUrl = `https://www.linkedin.com/profile/add?${params.toString()}`;
    
    // Award XP for LinkedIn share
    awardXP({
      activityKey: 'linkedin_share',
      description: 'Added certificate to LinkedIn profile',
    });
    
    window.open(linkedInUrl, "_blank");
    toast.success("Adding certification to your LinkedIn profile!");
  };

  const handleSharePost = () => {
    navigator.clipboard.writeText(shareText);
    
    awardXP({
      activityKey: 'linkedin_share',
      description: 'Shared certificate on LinkedIn',
    });
    
    window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank");
    toast.success("Post text copied! Paste it in LinkedIn.", { duration: 4000 });
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(shareText);
    toast.success("Share text copied to clipboard!");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    toast.success("Certificate ID copied!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Animation */}
      <div className="text-center mb-8 animate-float-in">
        <div className="inline-block relative mb-6">
          <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-6 shadow-xl">
            <Award className="h-20 w-20 text-white" />
          </div>
        </div>
      </div>

      {/* Congratulations Header */}
      <div className="text-center mb-12 animate-float-in" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-5xl md:text-6xl font-black mb-4">
          <span className="text-gradient-brand">Congratulations!</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You're now officially a <strong>PromptAndGo Certified Professional</strong>. Your achievement has been recorded and verified.
        </p>
      </div>

      {/* Premium Certificate Card */}
      <Card className="mb-12 overflow-hidden shadow-xl animate-float-in border-2 border-primary/20" style={{ animationDelay: "0.2s" }}>
        <div className="relative p-8 md:p-12 bg-gradient-to-br from-card to-card/50">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <img
                src="/lovable-uploads/99652d74-cac3-4e8f-ad70-8d2b77303b54.png"
                alt="PromptAndGo Logo"
                className="h-20 w-auto mx-auto mb-6"
              />
              <div className="space-y-2 mb-6">
                <div className="inline-block px-4 py-1 bg-accent/10 rounded-full">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">Official Certificate</p>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gradient-brand">
                  Prompt Like a Pro
                </h3>
                <p className="text-sm text-muted-foreground font-semibold">PromptAndGo Certified Professional</p>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full"></div>
            </div>

            {/* Certification Details */}
            <div className="text-center space-y-6 py-8">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Presented to</p>
              <p className="text-4xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {fullName}
              </p>

              <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed italic">
                For successfully completing the comprehensive PromptAndGo certification program and demonstrating exceptional mastery in AI prompt engineering and creative excellence.
              </p>
            </div>

            {/* Footer with Credentials */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50 mt-8">
              <div className="text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Completion Date</p>
                <p className="text-sm font-semibold text-foreground">{completionDate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Status</p>
                <div className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-accent">Verified</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Certificate ID</p>
                <button
                  onClick={handleCopyId}
                  className="text-sm font-mono font-bold text-primary hover:text-accent transition-colors flex items-center justify-center gap-1 mx-auto"
                  title="Click to copy"
                >
                  {certificateId}
                  {copiedId ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-50" />
                  )}
                </button>
              </div>
            </div>

            {/* Verification URL */}
            <div className="mt-8 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-xs text-muted-foreground mb-2">Verify this credential online:</p>
              <p className="text-xs font-mono text-accent break-all">promptandgo.ai/verify/{certificateId}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons - Primary CTA */}
      <div className="space-y-4 mb-8 animate-float-in" style={{ animationDelay: "0.3s" }}>
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={handleDownloadCertificate}
            size="lg"
            className="h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Certificate
          </Button>
          <Button
            onClick={handleAddToLinkedIn}
            size="lg"
            className="h-12 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Add to LinkedIn
          </Button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8 animate-float-in" style={{ animationDelay: "0.4s" }}>
        <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          Share your achievement with your network
        </p>
        <div className="space-y-3">
          <Button
            onClick={handleSharePost}
            variant="outline"
            className="w-full justify-start h-11 hover:border-primary hover:text-primary transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2 text-accent" />
            Share on LinkedIn Feed
          </Button>
          <Button
            onClick={handleCopyShareText}
            variant="outline"
            className="w-full justify-start h-11 hover:border-accent hover:text-accent transition-colors"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Share Text
          </Button>
        </div>
      </div>

      {/* Next Step */}
      <div className="text-center animate-float-in" style={{ animationDelay: "0.5s" }}>
        <Button
          onClick={onNext}
          size="lg"
          variant="outline"
          className="px-8 h-12 border-2 hover:border-primary hover:bg-primary/5 font-semibold transition-all duration-300"
        >
          Continue to Final Step →
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          You're one step away from unlocking exclusive benefits
        </p>
      </div>
    </div>
  );
}
