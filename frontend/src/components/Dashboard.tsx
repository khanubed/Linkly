import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { 
  Link, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  BarChart3, 
  Copy, 
  ExternalLink, 
  Trash2,
  Plus,
  TrendingUp,
  MousePointer,
  Globe,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricingModal } from './PricingModal';
import { AnalyticsCard } from './AnalyticsCard';

type SubscriptionPlan = 'free' | 'pro' | 'business';

import { User as UserData } from '../context/AuthContext';
import { UrlData } from '../context/UrlContext';
import { AuthContext } from '../context/AuthContext';
import { UrlContext  } from '../context/UrlContext';
import { AnalyticsContext } from '../context/AnalyticsContext';

interface DashboardProps {
  // onNavigate: (page: 'landing' | 'signup' | 'login' | 'dashboard' | 'admin') => void;
  // onLogout: () => void;
  // isAdmin: boolean;
  // userData: UserData;
  onUpgrade: (plan: 'pro' | 'business') => void;
  // onLinkCreated: () => void;
}

const backendURL = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendURL



export function Dashboard({ onUpgrade }: DashboardProps) {
  const [urlInput, setUrlInput] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const { handleLogout : onLogout , userData , setUserData , isAdmin , navigate : onNavigate } = useContext(AuthContext)
  const { topCountry , monthlyClicks  } = useContext<any>(AnalyticsContext)
  const { handleLinkCreated , urls , setUrls , setShowPricingModal , showPricingModal , handleDeleteUrl , fetchUrls , getLinksLimit , getLinksRemaining  } = useContext(UrlContext)


  useEffect(() => {
    fetchUrls()
  }, [])
  

  const chartData = [
    { name: 'Mon', clicks: 400 },
    { name: 'Tue', clicks: 300 },
    { name: 'Wed', clicks: 600 },
    { name: 'Thu', clicks: 800 },
    { name: 'Fri', clicks: 700 },
    { name: 'Sat', clicks: 900 },
    { name: 'Sun', clicks: 650 }
  ];

const handleShortenUrl = async () => {
  if (!urlInput.trim() || !userData) return;
      await handleLinkCreated(urlInput, customAlias);
      setUrlInput("");
      setCustomAlias("");
};

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification
  };


  const totalClicks = urls.reduce((sum : number, url : UrlData) => sum + url.visits, 0);



  if (!userData) {
    return <div className='text-center'>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Link className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-primary">Linkly</span>
            </div>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                className="pl-9 w-80 border-border"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => onNavigate('admin')}
                className="border-primary/20 hover:bg-primary/10"
              >
                Admin Panel
              </Button>
            )}
            
            {/* Subscription Status */}
            <div className="hidden md:flex items-center gap-4">
              <Badge 
                variant={userData.subscriptionPlan === 'free' ? 'secondary' : 'default'}
                className={`${
                  userData.subscriptionPlan === 'pro' ? 'bg-blue-600 hover:bg-blue-700' :
                  userData.subscriptionPlan === 'business' ? 'bg-purple-600 hover:bg-purple-700' :
                  ''
                }`}
              >
                {userData.subscriptionPlan === 'free' ? 'Free Plan' :
                 userData.subscriptionPlan === 'pro' ? 'Pro Plan' : 'Business Plan'}
              </Badge>
              
              {userData.subscriptionPlan === 'free' && (
                <div className="text-sm text-muted-foreground">
                  {getLinksRemaining()} links remaining
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userData.fullName ? userData.fullName[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Usage Alert for Free Users */}
        {userData.subscriptionPlan === 'free' && userData.linksCreated >= 8 && (
          <Card className="border-amber-500/50 bg-amber-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">You're almost at your limit!</h3>
                    <p className="text-sm text-muted-foreground">
                      {getLinksRemaining()} links remaining in your free plan
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowPricingModal(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Links Created</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.linksCreated}</div>
              <p className="text-xs text-muted-foreground">
                {userData.subscriptionPlan === 'free' 
                  ? `${getLinksRemaining()} remaining` 
                  : userData.subscriptionPlan === 'pro' 
                    ? `${1000 - userData.linksCreated} remaining` 
                    : 'Unlimited'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {/* +12% from last week */}
              </p>
            </CardContent>
          </Card>
{/* 
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% from last week
              </p>
            </CardContent>
          </Card> */}

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Country</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCountry?.country || "-"}</div>
              <p className="text-xs text-muted-foreground">
                {topCountry?.percentage || 0}% of total clicks
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyClicks?.currentMonthClicks.toLocaleString() || 0  }</div>
              <p className="text-xs text-muted-foreground">
                {monthlyClicks?.percentageChange ? `${monthlyClicks?.percentageChange}%` : '0%'} vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* URL Shortener */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Shorten a new URL
            </CardTitle>
            <CardDescription>
              Create a new short link with optional custom alias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Enter your long URL here..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 h-12 border-2 border-border focus:border-primary transition-colors"
                />
                <Input
                  placeholder="Custom alias (optional)"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="md:w-48 h-12 border-2 border-border focus:border-primary transition-colors"
                />
                <Button 
                  onClick={handleShortenUrl}
                  className="h-12 px-8"
                  disabled={!urlInput.trim() || (userData.subscriptionPlan === 'free' && userData.linksCreated >= 10)}
                >
                  {userData.subscriptionPlan === 'free' && userData.linksCreated >= 10 
                    ? 'Upgrade to Continue' 
                    : 'Shorten'
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Links Table */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Your Links</CardTitle>
                <CardDescription>
                  Manage and track your shortened URLs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead>Short URL</TableHead>
                        <TableHead className="hidden md:table-cell">Original URL</TableHead>
                        <TableHead>Visits</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urls.map((url : UrlData) => (
                        <TableRow key={url._id} className="border-border">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <span className="text-primary font-mono text-sm">
                                {url.shortUrl.replace('https://lnk.ly/', '')}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(url.shortUrl)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="max-w-xs truncate text-muted-foreground">
                              {url.originalUrl}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {url.visits.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => window.open(url.shortUrl, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteUrl(url._id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div className="space-y-6">
            <AnalyticsCard title="Weekly Traffic" type="traffic" />
            <AnalyticsCard title="Performance Overview" type="overview" />
          </div>
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AnalyticsCard title="Device Breakdown" type="devices" />
          <AnalyticsCard title="Top Locations" type="locations" />
          <AnalyticsCard title="Traffic Sources" type="referrers" />
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onUpgrade={onUpgrade}
        currentLinksUsed={userData.linksCreated}
      />
    </div>
  );
}