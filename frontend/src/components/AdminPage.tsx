import React, { use, useContext, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { 
  Link, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  BarChart3, 
  Trash2,
  Shield,
  Users,
  Activity,
  Eye,
  ArrowLeft,
  MoreVertical,
  Crown,
  TrendingUp,
  Globe,
  Clock,
  Filter
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { AuthContext } from '../context/AuthContext';
import { NavContext } from '../context/NavigationContext';
// import { set } from 'mongoose';
// import { toggleUserStatus } from '../../../backend/controllers/admin';



export interface UserData {
  _id: string;
  fullName: string;
  email: string;

  subscriptionPlan: "free" | "pro" | "business";
  subscriptionStatus: "active" | "inactive" | "cancelled";

  linksCreated: number;
  totalClicks: number;

  isAdmin: boolean;
  status: "active" | "suspended";

  createdAt: string; // ISO string from backend
  updatedAt: string;

  __v?: number;
}


export function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [revenue, setRevenue] = useState<number>(0);
  const [transactions, setTransactions] = useState<number>(0);

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    getUsers();
    setUsers(users.filter(user => user._id !== userId));
  };

  const getUsers = async () => {
    const fetchedUsers = await fetchUsersList();
      // console.log(fetchedUsers);
      if (fetchedUsers) {
        setUsers(fetchedUsers);
        // console.log(users);
      }
    };

    const { handleLogout : onLogout } = useContext(AuthContext)
    const {navigate : onNavigate} = useContext(NavContext)
  const { fetchUsersList , deleteUser , toggleUserStatus , fetchRevenue } = useContext(AdminContext);

  const loadRevenue = async () => {
    const res = await fetchRevenue();
    if (res.success) {
      setRevenue(res.totalRevenue);
      setTransactions(res.totalTransactions);
    }
  };


  const handleToggleUserStatus = (userId: string) => {
    toggleUserStatus(userId);
    setUsers(users.map(user => 
      user._id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  useEffect(() => {    
    getUsers();
    loadRevenue()
  //  console.log('Users in AdminPage useEffect:', userList);
  
  }, []);
  
  // useEffect(() => {
  //   console.log('Users updated:', users);
  // }, [users]);


  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalUrls = users.reduce((sum, user) => sum + user.linksCreated, 0);
  const totalClicks = users.reduce((sum, user) => sum + user.totalClicks, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-primary/10 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">System Management</p>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 h-10 border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => onNavigate('dashboard')} className="hover:bg-primary/10">
                  <User className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Link className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUrls}</div>
              <p className="text-xs text-muted-foreground">
                Across all users
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Platform-wide clicks
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round((activeUsers / totalUsers) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                User activity rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹ {revenue/100}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                From { transactions } transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Manage user accounts, monitor activity, and control access across the platform
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-border/50 hover:bg-primary/10">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-border/50 hover:bg-primary/10">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Activity
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 bg-muted/30">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">URLs Created</TableHead>
                    <TableHead className="font-semibold">Total Clicks</TableHead>
                    <TableHead className="font-semibold">Join Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="border-border">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted">
                              {user.fullName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {user.linksCreated}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {user.totalClicks.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                          className={user.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user._id)}>
                              {user.status === 'active' ? (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e : any) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.fullName}'s account? 
                                    This action cannot be undone and will permanently delete 
                                    all their shortened URLs and analytics data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Account
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No users found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'No users have signed up yet.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}