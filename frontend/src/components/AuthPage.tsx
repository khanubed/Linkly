import React, { useState , useContext} from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Link, ArrowLeft, Shield, Zap, CheckCircle, Globe } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

interface AuthPageProps {
  mode: 'login' | 'signup';
}


export function AuthPage({ mode  }: AuthPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleLogin , handleSignup , navigate : onNavigate   } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (mode === 'login') {
        handleLogin(email, password);
      } else {
        handleSignup(name, email, password);
      }      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Side - Features (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-blue-500/10 p-12 items-center justify-center relative">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Link className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-primary">Linkly</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              {mode === 'login' ? 'Welcome back!' : 'Join thousands of teams'}
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {mode === 'login' 
                ? 'Continue your journey with the most powerful link management platform.' 
                : 'Start building better connections with your audience today.'
              }
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-muted-foreground">Advanced analytics & insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-muted-foreground">Custom domains & branding</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-500" />
                </div>
                <span className="text-muted-foreground">Enterprise-grade security</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-card/50 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Trusted by industry leaders</p>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">Fortune 500</Badge>
                <Badge variant="secondary">Startups</Badge>
                <Badge variant="secondary">Agencies</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative">
          <div className="w-full max-w-md">
            {/* Back to Home Button */}
            <Button
              variant="ghost"
              onClick={() => onNavigate('landing')}
              className="mb-8 group self-start hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>

            <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-lg">
              <CardHeader className="text-center space-y-6 pb-6">
                {/* Logo - only show on mobile */}
                <div className="flex justify-center lg:hidden">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                    <Link className="h-7 w-7 text-primary-foreground" />
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {mode === 'login' 
                      ? 'Sign in to your Linkly account' 
                      : 'Start your journey with powerful link management'
                    }
                  </CardDescription>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Lightning fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'signup' && (
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-14 border-2 focus:border-primary transition-all duration-300 bg-background/50 text-base rounded-xl"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 border-2 focus:border-primary transition-all duration-300 bg-background/50 text-base rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-14 pr-14 border-2 focus:border-primary transition-all duration-300 bg-background/50 text-base rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        )}
                      </Button>
                    </div>
                    {mode === 'signup' && (
                      <p className="text-xs text-muted-foreground">
                        Password should be at least 8 characters long
                      </p>
                    )}
                  </div>

                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-muted-foreground">Remember me</span>
                      </label>
                      <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
                        {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      mode === 'login' ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground text-base">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary hover:text-primary/80 text-base"
                      onClick={() => onNavigate(mode === 'login' ? 'signup' : 'login')}
                    >
                      {mode === 'login' ? 'Sign up for free' : 'Sign in'}
                    </Button>
                  </p>
                </div>

                {mode === 'signup' && (
                  <div className="mt-6 text-center text-xs text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80">
                      Terms of Service
                    </Button>{' '}
                    and{' '}
                    <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80">
                      Privacy Policy
                    </Button>
                  </div>
                )}

                {/* Demo Credentials */}
                <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-primary">Demo Credentials</p>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between items-center">
                      <span><strong>User:</strong> user@linkly.com</span>
                      <span className="text-xs bg-card px-2 py-1 rounded">password123</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span><strong>Admin:</strong> admin@linkly.com</span>
                      <span className="text-xs bg-card px-2 py-1 rounded">admin123</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}