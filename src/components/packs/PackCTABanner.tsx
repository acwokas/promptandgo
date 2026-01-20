import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, ArrowRight, Infinity, Crown, Sparkles } from "lucide-react";

interface PackCTABannerProps {
  variant?: "lifetime" | "membership" | "bundle";
}

export function PackCTABanner({ variant = "lifetime" }: PackCTABannerProps) {
  if (variant === "lifetime") {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-accent border-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Infinity className="h-6 w-6 text-primary-foreground" />
                <span className="text-xs font-semibold text-primary-foreground/80 uppercase tracking-wide">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
                Lifetime Access — All Packs Included
              </h3>
              <p className="text-primary-foreground/80 text-sm">
                One payment. Every pack. Forever. Plus all future releases.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-primary-foreground/60 line-through text-lg">$199</span>
                <span className="text-3xl font-bold text-primary-foreground">$99.50</span>
                <span className="bg-white/20 text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                  SAVE 50%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
              >
                <Link to="/cart?add=lifetime">
                  <Crown className="h-4 w-4 mr-2" />
                  Get Lifetime Access
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <span className="text-xs text-primary-foreground/70 text-center">
                🔒 Secure checkout • Instant access
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "membership") {
    return (
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Monthly Membership
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">
                Unlimited Access to All Prompts
              </h3>
              <p className="text-muted-foreground text-sm">
                Access every prompt in our library. Cancel anytime.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">$12.99/mo</div>
                <div className="text-xs text-muted-foreground">Billed monthly</div>
              </div>
              <Button asChild variant="hero">
                <Link to="/cart?add=membership">
                  <Zap className="h-4 w-4 mr-2" />
                  Subscribe
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
