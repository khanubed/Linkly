import React, { useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AnalyticsContext } from '../context/AnalyticsContext';

interface AnalyticsCardProps {
  title: string;
  type: 'traffic' | 'devices' | 'locations' | 'referrers' | 'overview';
  data?: any;
}

export function AnalyticsCard({ title, type, data }: AnalyticsCardProps) {
 const { deviceData, locationData, referrerData, hourlyData , fetchAnalytics , analytics} = useContext<any>(AnalyticsContext);

 useEffect(() => {
   fetchAnalytics();
 }, []);
  
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'traffic':
        if (!hourlyData) return null;
        return (
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Peak: 2-4 PM</span>
              <div className="flex items-center gap-1">
                {getTrendIcon('up')}
                <span className="text-green-500">+15% vs yesterday</span>
              </div>
            </div>
          </div>
        );

      case 'devices':
        if (!deviceData) return null;
        return (
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry : any, index : any) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {deviceData.map((device : any, index : any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.name)}
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm font-medium">{device.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'locations':
        if (!locationData) return null;
        return (
          <div className="space-y-3">
            {locationData.map((location : any, index : any) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{location.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {location.clicks.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {location.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={location.percentage} className="h-2" />
              </div>
            ))}
          </div>
        );

      case 'referrers':
        if (!referrerData) return null;
        return (
          
          <div className="space-y-3">
            {referrerData.map((referrer: any, index : any) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-medium">{referrer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {referrer.clicks.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {referrer.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={referrer.percentage} className="h-2" />
              </div>
            ))}
          </div>
        );

      case 'overview':
        // if (!data) return null;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Click Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">4.2%</span>
                {getTrendIcon('up')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Avg. Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">247</span>
                {getTrendIcon('up')}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {type === 'traffic' && (
          <CardDescription>
            Clicks by hour over the last 24 hours
          </CardDescription>
        )}
        {type === 'devices' && (
          <CardDescription>
            Device breakdown for all clicks
          </CardDescription>
        )}
        {type === 'locations' && (
          <CardDescription>
            Top countries by click volume
          </CardDescription>
        )}
        {type === 'referrers' && (
          <CardDescription>
            Traffic sources and referrers
          </CardDescription>
        )}
        {type === 'overview' && (
          <CardDescription>
            Key performance metrics
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}