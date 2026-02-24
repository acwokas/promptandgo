import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';

interface CountryData {
  name: string;
  flag: string;
  professionals: number;
  topLanguages: string;
  personas: {
    business: number;
    creative: number;
    technical: number;
    other: number;
  };
  region: 'northeast' | 'southeast' | 'south' | 'south-east' | 'far-south';
  x: number; // percentage from left
  y: number; // percentage from top
}

const countryData: CountryData[] = [
  {
    name: 'Singapore',
    flag: '🇸🇬',
    professionals: 50625,
    topLanguages: 'English, Mandarin, Malay',
    personas: { business: 52, creative: 28, technical: 15, other: 5 },
    region: 'south-east',
    x: 72,
    y: 65,
  },
  {
    name: 'Indonesia',
    flag: '🇮🇩',
    professionals: 537854,
    topLanguages: 'Bahasa Indonesia',
    personas: { business: 49, creative: 32, technical: 14, other: 5 },
    region: 'southeast',
    x: 55,
    y: 75,
  },
  {
    name: 'Vietnam',
    flag: '🇻🇳',
    professionals: 425343,
    topLanguages: 'Vietnamese',
    personas: { business: 51, creative: 29, technical: 15, other: 5 },
    region: 'northeast',
    x: 70,
    y: 40,
  },
  {
    name: 'Malaysia',
    flag: '🇲🇾',
    professionals: 10969,
    topLanguages: 'Malay, English',
    personas: { business: 53, creative: 27, technical: 15, other: 5 },
    region: 'south-east',
    x: 60,
    y: 58,
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    professionals: 104647,
    topLanguages: 'English',
    personas: { business: 50, creative: 30, technical: 15, other: 5 },
    region: 'far-south',
    x: 68,
    y: 85,
  },
];

const totalProfessionals = 1129438;

export function APACMarketMap() {
  const [expandedCountry, setExpandedCountry] = useState<string | null>('Indonesia');
  const [displayedCount, setDisplayedCount] = useState(0);
  const countRef = useRef<number>(0);

  // Animated counter for total professionals
  useEffect(() => {
    const interval = setInterval(() => {
      if (countRef.current < totalProfessionals) {
        countRef.current += Math.ceil(totalProfessionals / 100);
        setDisplayedCount(Math.min(countRef.current, totalProfessionals));
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const currentData = countryData.find((c) => c.name === expandedCountry);

  return (
    <section className="container py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-accent" />
          <span className="text-sm font-semibold text-accent">MARKET OPPORTUNITY</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">The Southeast Asia Advantage</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Over 1.9 million APAC professionals actively searching and optimizing prompts. That's your market—and they're growing every day.
        </p>
      </div>

      {/* Total Counter */}
      <div className="text-center mb-12">
        <div className="inline-block bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 border border-accent/20">
          <p className="text-sm text-muted-foreground mb-2">Total APAC Professionals</p>
          <div className="text-5xl font-bold mb-2">
            {formatNumber(displayedCount)}
            <span className="text-2xl text-accent">+</span>
          </div>
          <p className="text-sm text-muted-foreground">And growing daily across all major markets</p>
        </div>
      </div>

      {/* Interactive Market Map */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10 aspect-video flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>

            {/* Country Cards - Positioned geographically */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" className="text-primary" />
                </pattern>
              </defs>
              <rect width="1000" height="800" fill="url(#dots)" />
            </svg>

            <div className="relative w-full h-full">
              {countryData.map((country, idx) => (
                <div
                  key={country.name}
                  style={{
                    position: 'absolute',
                    left: `${country.x}%`,
                    top: `${country.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="z-10"
                >
                  <button
                    onClick={() =>
                      setExpandedCountry(
                        expandedCountry === country.name ? null : country.name
                      )
                    }
                    className={`group transition-all duration-300 transform ${
                      expandedCountry === country.name ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {/* Pulse Ring */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-300 ${
                        expandedCountry === country.name
                          ? 'ring-4 ring-primary animate-pulse'
                          : 'ring-2 ring-border group-hover:ring-primary/50'
                      }`}
                      style={{
                        width: `${60 + idx * 5}px`,
                        height: `${60 + idx * 5}px`,
                        marginLeft: `-${(60 + idx * 5) / 2}px`,
                        marginTop: `-${(60 + idx * 5) / 2}px`,
                      }}
                    />

                    {/* Flag */}
                    <div className="text-3xl">{country.flag}</div>

                    {/* Label below */}
                    <div className="text-xs font-bold text-foreground whitespace-nowrap mt-1 bg-card px-2 py-1 rounded border border-border">
                      {country.name}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/50 ring-2 ring-primary/20" />
                <span>Market Size</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-primary ring-2 ring-primary/20" />
                <span>Active User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Country Details Panel */}
        <div>
          {currentData ? (
            <div className="space-y-4 h-full">
              {/* Main Card */}
              <Card className="border-l-4 border-accent overflow-hidden bg-gradient-to-br from-accent/5 to-transparent sticky top-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-4xl mb-2">{currentData.flag}</div>
                      <h3 className="text-2xl font-bold">{currentData.name}</h3>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>

                  {/* Professional Count with animation */}
                  <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-xs text-muted-foreground mb-1">PROFESSIONALS</p>
                    <p className="text-3xl font-bold text-accent">
                      {formatNumber(currentData.professionals)}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      TOP LANGUAGES
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentData.topLanguages.split(',').map((lang) => (
                        <span
                          key={lang.trim()}
                          className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                        >
                          {lang.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Personas Breakdown */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">
                      USER BREAKDOWN
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          label: 'Business',
                          value: currentData.personas.business,
                          color: 'bg-blue-500',
                        },
                        {
                          label: 'Creative',
                          value: currentData.personas.creative,
                          color: 'bg-purple-500',
                        },
                        {
                          label: 'Technical',
                          value: currentData.personas.technical,
                          color: 'bg-green-500',
                        },
                        {
                          label: 'Other',
                          value: currentData.personas.other,
                          color: 'bg-gray-500',
                        },
                      ].map((persona) => (
                        <div key={persona.label}>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-muted-foreground">{persona.label}</span>
                            <span className="font-semibold text-foreground">
                              {persona.value}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                            <div
                              className={`${persona.color} h-full transition-all duration-500`}
                              style={{ width: `${persona.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    OPPORTUNITY
                  </p>
                  <p className="text-sm text-foreground">
                    {currentData.professionals > 100000
                      ? `${currentData.name} is a major growth hub with massive demand for multilingual prompt optimization.`
                      : `${currentData.name} represents a concentrated, high-value market with specialized needs.`}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center sticky top-8">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Click on a country to see detailed market insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {[
          { label: 'Total Markets', value: '5' },
          { label: 'Total Professionals', value: '1.9M+' },
          { label: 'Languages Supported', value: '5+' },
          { label: 'Growth Rate', value: '62.7%' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gradient-brand">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
