// Settings service for managing user preferences and configuration

export const settingsService = {
  // Get user profile settings
  async getUserProfile() {
    try {
      const profile = localStorage.getItem('userProfile');
      if (profile) {
        return {
          success: true,
          profile: JSON.parse(profile)
        };
      }

      // Default profile
      const defaultProfile = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        avatar: null,
        bio: 'Freelance web developer and designer with 5+ years of experience.',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        language: 'en'
      };

      return {
        success: true,
        profile: defaultProfile
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      return {
        success: true,
        profile: profileData
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get business settings
  async getBusinessSettings() {
    try {
      const settings = localStorage.getItem('businessSettings');
      if (settings) {
        return {
          success: true,
          settings: JSON.parse(settings)
        };
      }

      // Default business settings
      const defaultSettings = {
        companyName: 'Freelance Studio',
        companyEmail: 'hello@freelancestudio.com',
        companyPhone: '+1 (555) 987-6543',
        companyAddress: '123 Business St, Suite 100',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States',
        taxId: '12-3456789',
        currency: 'USD',
        logo: null,
        website: 'https://freelancestudio.com',
        invoicePrefix: 'INV',
        invoiceFooter: 'Thank you for your business!',
        paymentTerms: 'Payment is due within 14 days of invoice date.'
      };

      return {
        success: true,
        settings: defaultSettings
      };
    } catch (error) {
      console.error('Error getting business settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update business settings
  async updateBusinessSettings(settingsData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('businessSettings', JSON.stringify(settingsData));
      
      return {
        success: true,
        settings: settingsData
      };
    } catch (error) {
      console.error('Error updating business settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get API keys
  async getApiKeys() {
    try {
      const apiKeys = localStorage.getItem('apiKeys');
      if (apiKeys) {
        return {
          success: true,
          apiKeys: JSON.parse(apiKeys)
        };
      }

      // Default API keys (empty for security)
      const defaultApiKeys = {
        openai: '',
        stripe: '',
        google: '',
        gmail: '',
        googleCalendar: '',
        slack: '',
        discord: '',
        webhookUrl: ''
      };

      return {
        success: true,
        apiKeys: defaultApiKeys
      };
    } catch (error) {
      console.error('Error getting API keys:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update API keys
  async updateApiKeys(apiKeysData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // In production, these would be encrypted before storage
      localStorage.setItem('apiKeys', JSON.stringify(apiKeysData));
      
      return {
        success: true,
        apiKeys: apiKeysData
      };
    } catch (error) {
      console.error('Error updating API keys:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Test API key connection
  async testApiKey(service, apiKey) {
    try {
      // Simulate API test delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock API test results (90% success rate for demo)
      const isValid = Math.random() > 0.1;

      if (isValid) {
        return {
          success: true,
          message: `${service} API key is valid and working`,
          status: 'connected'
        };
      } else {
        return {
          success: false,
          error: `Invalid ${service} API key or service unavailable`,
          status: 'error'
        };
      }
    } catch (error) {
      console.error(`Error testing ${service} API key:`, error);
      return {
        success: false,
        error: error.message,
        status: 'error'
      };
    }
  },

  // Get notification preferences
  async getNotificationPreferences() {
    try {
      const preferences = localStorage.getItem('notificationPreferences');
      if (preferences) {
        return {
          success: true,
          preferences: JSON.parse(preferences)
        };
      }

      // Default notification preferences
      const defaultPreferences = {
        email: {
          invoiceReminders: true,
          paymentReceived: true,
          projectDeadlines: true,
          clientMessages: true,
          systemUpdates: false,
          marketingEmails: false
        },
        push: {
          enabled: true,
          invoiceReminders: true,
          paymentReceived: true,
          projectDeadlines: true,
          clientMessages: true
        },
        inApp: {
          enabled: true,
          sound: true,
          desktop: true,
          frequency: 'immediate' // immediate, hourly, daily
        }
      };

      return {
        success: true,
        preferences: defaultPreferences
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update notification preferences
  async updateNotificationPreferences(preferencesData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem('notificationPreferences', JSON.stringify(preferencesData));
      
      return {
        success: true,
        preferences: preferencesData
      };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get system preferences
  async getSystemPreferences() {
    try {
      const preferences = localStorage.getItem('systemPreferences');
      if (preferences) {
        return {
          success: true,
          preferences: JSON.parse(preferences)
        };
      }

      // Default system preferences
      const defaultPreferences = {
        theme: 'light', // light, dark, auto
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        timezone: 'America/Los_Angeles',
        autoSave: true,
        compactMode: false,
        animations: true,
        soundEffects: true
      };

      return {
        success: true,
        preferences: defaultPreferences
      };
    } catch (error) {
      console.error('Error getting system preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update system preferences
  async updateSystemPreferences(preferencesData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem('systemPreferences', JSON.stringify(preferencesData));
      
      // Apply theme changes immediately
      if (preferencesData.theme) {
        this.applyTheme(preferencesData.theme);
      }

      return {
        success: true,
        preferences: preferencesData
      };
    } catch (error) {
      console.error('Error updating system preferences:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Apply theme changes
  applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },

  // Upload avatar/logo
  async uploadFile(file, type = 'avatar') {
    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock file upload (in production, this would upload to cloud storage)
      const fileUrl = URL.createObjectURL(file);
      
      return {
        success: true,
        url: fileUrl,
        filename: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Export settings and data
  async exportData() {
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const exportData = {
        userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
        businessSettings: JSON.parse(localStorage.getItem('businessSettings') || '{}'),
        notificationPreferences: JSON.parse(localStorage.getItem('notificationPreferences') || '{}'),
        systemPreferences: JSON.parse(localStorage.getItem('systemPreferences') || '{}'),
        projects: JSON.parse(localStorage.getItem('projects') || '[]'),
        clients: JSON.parse(localStorage.getItem('clients') || '[]'),
        invoices: JSON.parse(localStorage.getItem('invoices') || '[]'),
        documents: JSON.parse(localStorage.getItem('documents') || '[]'),
        exportDate: new Date().toISOString()
      };

      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        url,
        filename: `freelancer-toolkit-export-${new Date().toISOString().split('T')[0]}.json`
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Import settings and data
  async importData(file) {
    try {
      // Simulate import delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data structure
      if (!importData.exportDate) {
        throw new Error('Invalid export file format');
      }

      // Import data to localStorage
      Object.keys(importData).forEach(key => {
        if (key !== 'exportDate' && importData[key]) {
          localStorage.setItem(key, JSON.stringify(importData[key]));
        }
      });

      return {
        success: true,
        message: 'Data imported successfully',
        importedItems: Object.keys(importData).length - 1
      };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Reset all settings to default
  async resetSettings() {
    try {
      // Simulate reset delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear all settings from localStorage
      const settingsKeys = [
        'userProfile',
        'businessSettings',
        'apiKeys',
        'notificationPreferences',
        'systemPreferences'
      ];

      settingsKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Reset theme to default
      this.applyTheme('light');

      return {
        success: true,
        message: 'All settings have been reset to default'
      };
    } catch (error) {
      console.error('Error resetting settings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Simulate password change delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock password validation (in production, this would verify against server)
      if (currentPassword !== 'current123') {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      if (newPassword.length < 8) {
        return {
          success: false,
          error: 'New password must be at least 8 characters long'
        };
      }

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Enable/disable two-factor authentication
  async toggleTwoFactor(enable) {
    try {
      // Simulate 2FA toggle delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const twoFactorSettings = {
        enabled: enable,
        method: enable ? 'app' : null, // app, sms, email
        setupDate: enable ? new Date().toISOString() : null
      };

      localStorage.setItem('twoFactorSettings', JSON.stringify(twoFactorSettings));

      return {
        success: true,
        settings: twoFactorSettings,
        message: enable ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'
      };
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default settingsService;

