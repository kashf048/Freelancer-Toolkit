import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building, 
  Key, 
  Bell, 
  Shield, 
  Palette, 
  Upload, 
  Save, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Settings as SettingsIcon,
  Camera,
  Check,
  X,
  AlertCircle,
  Info,
  Download,
  FileUp,
  Trash2,
  Monitor,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({});
  
  // Profile Settings State
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    bio: 'Experienced freelance web developer specializing in React and Node.js applications.',
    timezone: 'America/Los_Angeles',
    avatar: null
  });

  // Business Settings State
  const [businessData, setBusinessData] = useState({
    companyName: 'Freelance Solutions',
    businessType: 'sole_proprietorship',
    taxId: '12-3456789',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'United States',
    currency: 'USD',
    language: 'en',
    logo: null,
    invoicePrefix: 'INV',
    invoiceNumbering: 'sequential',
    paymentTerms: '30',
    lateFee: '5',
    bankName: 'Chase Bank',
    accountNumber: '****1234',
    routingNumber: '****5678'
  });

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    stripe: '',
    paypal: '',
    mailgun: '',
    twilio: '',
    google: '',
    github: ''
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    projectUpdates: true,
    paymentReminders: true,
    invoiceUpdates: true,
    clientMessages: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: true
  });

  // System Preferences State
  const [systemPreferences, setSystemPreferences] = useState({
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    autoSave: true,
    compactMode: false,
    showTips: true,
    enableAnimations: true,
    defaultView: 'dashboard',
    itemsPerPage: '10'
  });

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessUpdate = (field, value) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
  };

  const handleApiKeyUpdate = (service, value) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const handleNotificationUpdate = (field, value) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceUpdate = (field, value) => {
    setSystemPreferences(prev => ({ ...prev, [field]: value }));
    
    // Handle theme changes with smooth transition
    if (field === 'theme') {
      document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        toast.success('Dark mode enabled');
      } else if (value === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        toast.success('Light mode enabled');
      } else {
        // System theme
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', 'system');
        toast.success('System theme enabled');
      }
      
      // Remove transition after theme change
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 300);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Business settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update business settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKeys = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API keys updated successfully!');
    } catch (error) {
      toast.error('Failed to update API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('System preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update system preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApiKeyVisibility = (service) => {
    setShowApiKeys(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateNewApiKey = (service) => {
    const newKey = `${service}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKeys(prev => ({ ...prev, [service]: newKey }));
    toast.success(`New ${service} API key generated!`);
  };

  const testApiKey = async (service) => {
    const apiKey = apiKeys[service];
    if (!apiKey) {
      toast.error(`Please enter ${service} API key first`);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${service} API key is valid!`);
    } catch (error) {
      toast.error(`Failed to validate ${service} API key`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBusinessData(prev => ({
          ...prev,
          logo: e.target.result
        }));
        toast.success('Business logo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences and business information
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                      {getInitials(profileData.firstName, profileData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a professional photo for your profile
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => handleProfileUpdate('website', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="Tell clients about your experience and expertise..."
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profileData.timezone} onValueChange={(value) => handleProfileUpdate('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your business details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Logo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {businessData.logo ? (
                      <img src={businessData.logo} alt="Business Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="logo-upload" className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Upload className="h-4 w-4" />
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Business Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload your business logo for invoices and documents
                  </p>
                </div>
              </div>

              {/* Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={businessData.companyName}
                    onChange={(e) => handleBusinessUpdate('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessData.businessType} onValueChange={(value) => handleBusinessUpdate('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    value={businessData.taxId}
                    onChange={(e) => handleBusinessUpdate('taxId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={businessData.currency} onValueChange={(value) => handleBusinessUpdate('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={businessData.address}
                      onChange={(e) => handleBusinessUpdate('address', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={businessData.city}
                      onChange={(e) => handleBusinessUpdate('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={businessData.state}
                      onChange={(e) => handleBusinessUpdate('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={businessData.zipCode}
                      onChange={(e) => handleBusinessUpdate('zipCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={businessData.country} onValueChange={(value) => handleBusinessUpdate('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Invoice Settings */}
              <div className="space-y-4">
                <h3 className="font-medium">Invoice Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input
                      id="invoicePrefix"
                      value={businessData.invoicePrefix}
                      onChange={(e) => handleBusinessUpdate('invoicePrefix', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                    <Input
                      id="paymentTerms"
                      type="number"
                      value={businessData.paymentTerms}
                      onChange={(e) => handleBusinessUpdate('paymentTerms', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveBusiness} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Business Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Security Notice</AlertTitle>
                <AlertDescription>
                  Keep your API keys secure and never share them publicly. These keys provide access to your accounts.
                </AlertDescription>
              </Alert>

              {/* API Key Fields */}
              {Object.entries(apiKeys).map(([service, key]) => (
                <div key={service} className="space-y-2">
                  <Label htmlFor={service} className="capitalize">{service} API Key</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id={service}
                        type={showApiKeys[service] ? 'text' : 'password'}
                        value={key}
                        onChange={(e) => handleApiKeyUpdate(service, e.target.value)}
                        placeholder={`Enter your ${service} API key`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleApiKeyVisibility(service)}
                      >
                        {showApiKeys[service] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {key && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateNewApiKey(service)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {key && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testApiKey(service)}
                        disabled={isLoading}
                      >
                        Test
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button onClick={handleSaveApiKeys} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save API Keys'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Methods */}
              <div className="space-y-4">
                <h3 className="font-medium">Notification Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about project status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('projectUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for overdue payments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => handleNotificationUpdate('paymentReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Invoice Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates about invoice status</p>
                    </div>
                    <Switch
                      checked={notificationSettings.invoiceUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('invoiceUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Client Messages</Label>
                      <p className="text-sm text-muted-foreground">New messages from clients</p>
                    </div>
                    <Switch
                      checked={notificationSettings.clientMessages}
                      onCheckedChange={(checked) => handleNotificationUpdate('clientMessages', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">Important system announcements</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('systemUpdates', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reports */}
              <div className="space-y-4">
                <h3 className="font-medium">Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activities</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationUpdate('weeklyReports', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Reports</Label>
                      <p className="text-sm text-muted-foreground">Monthly business performance reports</p>
                    </div>
                    <Switch
                      checked={notificationSettings.monthlyReports}
                      onCheckedChange={(checked) => handleNotificationUpdate('monthlyReports', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Notification Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>
                Customize your application experience and interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="font-medium">Appearance</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={systemPreferences.theme} onValueChange={(value) => handlePreferenceUpdate('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact interface</p>
                    </div>
                    <Switch
                      checked={systemPreferences.compactMode}
                      onCheckedChange={(checked) => handlePreferenceUpdate('compactMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Animations</Label>
                      <p className="text-sm text-muted-foreground">Show smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={systemPreferences.enableAnimations}
                      onCheckedChange={(checked) => handlePreferenceUpdate('enableAnimations', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Localization */}
              <div className="space-y-4">
                <h3 className="font-medium">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={systemPreferences.language} onValueChange={(value) => handlePreferenceUpdate('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={systemPreferences.dateFormat} onValueChange={(value) => handlePreferenceUpdate('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select value={systemPreferences.timeFormat} onValueChange={(value) => handlePreferenceUpdate('timeFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={systemPreferences.currency} onValueChange={(value) => handlePreferenceUpdate('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Behavior */}
              <div className="space-y-4">
                <h3 className="font-medium">Behavior</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                    </div>
                    <Switch
                      checked={systemPreferences.autoSave}
                      onCheckedChange={(checked) => handlePreferenceUpdate('autoSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Tips</Label>
                      <p className="text-sm text-muted-foreground">Display helpful tips and tutorials</p>
                    </div>
                    <Switch
                      checked={systemPreferences.showTips}
                      onCheckedChange={(checked) => handlePreferenceUpdate('showTips', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default View</Label>
                    <Select value={systemPreferences.defaultView} onValueChange={(value) => handlePreferenceUpdate('defaultView', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="clients">Clients</SelectItem>
                        <SelectItem value="invoices">Invoices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Items Per Page</Label>
                    <Select value={systemPreferences.itemsPerPage} onValueChange={(value) => handlePreferenceUpdate('itemsPerPage', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePreferences} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;

