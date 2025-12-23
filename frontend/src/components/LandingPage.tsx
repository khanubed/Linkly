import React, { useState, useEffect, useContext } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Link, BarChart3, QrCode, Shield, Zap, Globe, Star, CheckCircle, ArrowRight, Users, Timer, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'signup' | 'login' | 'dashboard' | 'admin') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    linksCreated: 0,
    clicksTracked: 0,
    activeUsers: 0
  });

  const { navigate } = useContext(AuthContext);


  useEffect(() => {
    setIsVisible(true);
    
    // Animate stats counter
    const targets = { linksCreated: 2847000, clicksTracked: 89300000, activeUsers: 52000 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        linksCreated: Math.floor(targets.linksCreated * progress),
        clicksTracked: Math.floor(targets.clicksTracked * progress),
        activeUsers: Math.floor(targets.activeUsers * progress)
      });
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  // const handleQuickShorten = () => {
  //   if (urlInput.trim()) {
  //     // For demo, just show a mock shortened URL
  //     alert(`Shortened URL: https://lnk.ly/abc123\nOriginal: ${urlInput}`);
  //     setUrlInput('');
  //   }
  // };

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Advanced Analytics',
      description: 'Track clicks, locations, devices, and referrers with detailed insights and real-time data.',
      stats: '99.9% accuracy'
    },
    {
      icon: <QrCode className="h-8 w-8 text-primary" />,
      title: 'QR Code Generation',
      description: 'Automatically generate QR codes for your shortened links with customizable designs.',
      stats: 'SVG & PNG formats'
    },
    {
      icon: <Link className="h-8 w-8 text-primary" />,
      title: 'Custom Short Links',
      description: 'Create branded short links with custom aliases that match your brand identity.',
      stats: 'Unlimited customization'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL encryption, spam protection, and malware detection.',
      stats: 'SOC 2 compliant'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director, TechCorp',
      content: 'Linkly transformed our campaign tracking. The analytics are incredibly detailed and the interface is so intuitive.',
      rating: 5,
      avatar: 'SC'
    },
    {
      name: 'Marcus Johnson',
      role: 'CEO, StartupXYZ',
      content: 'We switched from Bitly to Linkly and never looked back. The custom domains feature is exactly what we needed.',
      rating: 5,
      avatar: 'MJ'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Social Media Manager',
      content: 'The QR code generation saves me hours every week. Perfect integration with our workflow.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg">
              <Link className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary">Linkly</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('login')} className="hover:bg-primary/10">
              Login
            </Button>
            <Button onClick={() => onNavigate('signup')} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className={`container mx-auto max-w-4xl text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
            <Zap className="h-4 w-4 mr-2" />
            Trusted by 50,000+ businesses worldwide
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent leading-tight">
            Shorten Links,
            <br />
            Amplify Results
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your long URLs into powerful, trackable short links. 
            Get detailed analytics, custom branding, and enterprise-grade security.
          </p>

          {/* Live Stats */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                {stats.linksCreated.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">Links Created</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                {stats.clicksTracked.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">Clicks Tracked</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-border"></div>
            <div className="group">
              <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">
                {stats.activeUsers.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </div>

          {/* URL Shortener Input */}
          <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-3xl p-8 mb-16 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-400/5 to-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <Input
                  type="url"
                  placeholder="Paste your long URL here..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 h-16 text-lg border-2 border-border/50 focus:border-primary transition-all duration-300 bg-background/70 backdrop-blur-sm rounded-xl shadow-inner"
                />
                <Button 
                  size="lg" 
                  onClick={()=> navigate('signup')}
                  className="h-16 px-10 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  <span className="group-hover:scale-110 transition-transform">Shorten URL</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No registration required
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full">
                  <Timer className="w-4 h-4 text-blue-500" />
                  Instant results
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4 text-purple-500" />
                  100% secure
                </div>
              </div>
            </div>
          </div>

          {/* Visual Illustration */}
          <div className="mb-20">
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-primary/20 via-blue-400/10 to-primary/20 rounded-3xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-lg">
                    <span className="text-sm text-muted-foreground truncate max-w-xs md:max-w-md">
                      https://example.com/very-long-url-that-is-difficult-to-remember-and-share
                    </span>
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary/20 to-primary/30 border-2 border-primary/30 rounded-xl p-6 shadow-lg">
                    <span className="text-lg font-semibold text-primary">
                      https://lnk.ly/magic
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +247% CTR
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Star className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Powerful features that help you create, manage, and analyze your links like a pro. 
              Built for teams and individuals who demand excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      {feature.stats}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </CardDescription>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0">
                      Learn more <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Users className="h-4 w-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with Linkly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <TrendingUp className="h-4 w-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start for free, upgrade when you need more. No hidden fees, no surprises. 
              Cancel anytime with our 30-day money-back guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-muted-foreground">Free</CardTitle>
                <div className="text-4xl font-bold my-2">
                  $0
                  <span className="text-lg text-muted-foreground font-normal">/month</span>
                </div>
                <CardDescription className="text-base">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>10 links per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>QR codes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>24/7 support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full h-12 border-2 hover:border-primary/50 hover:bg-primary/5 group-hover:scale-105 transition-all" onClick={() => onNavigate('signup')}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-card/50 backdrop-blur-sm shadow-2xl shadow-primary/10 relative scale-105 hover:scale-110 transition-all duration-300 group">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 shadow-lg">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl text-primary">Pro</CardTitle>
                <div className="text-4xl font-bold my-2">
                  $9
                  <span className="text-lg text-muted-foreground font-normal">/month</span>
                </div>
                <CardDescription className="text-base">For professionals & teams</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>1,000 links per month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Custom domains</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg group-hover:scale-105 transition-all" onClick={() => onNavigate('signup')}>
                  Start Pro Trial
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm relative hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-muted-foreground">Business</CardTitle>
                <div className="text-4xl font-bold my-2">
                  $29
                  <span className="text-lg text-muted-foreground font-normal">/month</span>
                </div>
                <CardDescription className="text-base">For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Unlimited links</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>White-label solution</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full h-12 border-2 hover:border-primary/50 hover:bg-primary/5 group-hover:scale-105 transition-all" onClick={() => onNavigate('signup')}>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-400/5 rounded-3xl"></div>
        <div className="container mx-auto max-w-5xl text-center relative">
          <div className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-3xl p-12 shadow-2xl">
            <Badge variant="outline" className="mb-6 text-primary border-primary/30">
              <Zap className="h-4 w-4 mr-2" />
              Ready to Transform Your Links?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses already using Linkly to grow their reach, 
              track performance, and build stronger connections with their audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                size="lg" 
                onClick={() => onNavigate('signup')} 
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => onNavigate('login')} 
                className="text-lg px-8 py-6 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              No credit card required • 30-day money-back guarantee • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Link className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-primary">Linkly</span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                The most powerful URL shortener for modern businesses. 
                Trusted by teams worldwide to create, track, and optimize their links.
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Star className="h-3 w-3 mr-1" />
                  4.9/5 Rating
                </Badge>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  SOC 2 Certified
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <div className="space-y-3 text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Pricing</a>
                <p className="hover:text-primary transition-colors cursor-pointer">Analytics</p>
                <p className="hover:text-primary transition-colors cursor-pointer">API Documentation</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Integrations</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <div className="space-y-3 text-muted-foreground">
                <p className="hover:text-primary transition-colors cursor-pointer">About Us</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Contact</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Terms of Service</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Security</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground">&copy; 2024 Linkly. All rights reserved.</p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="hover:text-primary transition-colors cursor-pointer">Status</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Changelog</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}