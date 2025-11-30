// Calendar service for Google Calendar integration and event management

// Mock Google Calendar API integration
const GOOGLE_CALENDAR_API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY || 'mock_api_key';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'mock_client_id';

export const calendarService = {
  // Initialize Google Calendar API (mock implementation)
  async initializeGoogleCalendar() {
    try {
      // In production, this would initialize the actual Google Calendar API
      return {
        isSignedIn: false,
        signIn: this.signInToGoogle,
        signOut: this.signOutFromGoogle,
        listEvents: this.listGoogleEvents,
        createEvent: this.createGoogleEvent,
        updateEvent: this.updateGoogleEvent,
        deleteEvent: this.deleteGoogleEvent
      };
    } catch (error) {
      console.error('Error initializing Google Calendar:', error);
      return null;
    }
  },

  // Sign in to Google Calendar
  async signInToGoogle() {
    try {
      // Simulate Google sign-in delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful sign-in
      const authResult = {
        isSignedIn: true,
        user: {
          email: 'user@example.com',
          name: 'John Doe',
          picture: 'https://via.placeholder.com/40'
        },
        accessToken: 'mock_access_token'
      };

      localStorage.setItem('googleCalendarAuth', JSON.stringify(authResult));
      return {
        success: true,
        authResult
      };
    } catch (error) {
      console.error('Error signing in to Google:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sign out from Google Calendar
  async signOutFromGoogle() {
    try {
      localStorage.removeItem('googleCalendarAuth');
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('Error signing out from Google:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // List events from Google Calendar
  async listGoogleEvents(timeMin, timeMax) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock Google Calendar events
      const googleEvents = [
        {
          id: 'google_event_1',
          summary: 'Team Meeting',
          description: 'Weekly team sync',
          start: { dateTime: '2024-02-16T09:00:00Z' },
          end: { dateTime: '2024-02-16T10:00:00Z' },
          location: 'Conference Room A',
          attendees: [
            { email: 'team@example.com', responseStatus: 'accepted' }
          ],
          source: 'google'
        },
        {
          id: 'google_event_2',
          summary: 'Doctor Appointment',
          description: 'Annual checkup',
          start: { dateTime: '2024-02-17T14:00:00Z' },
          end: { dateTime: '2024-02-17T15:00:00Z' },
          location: 'Medical Center',
          source: 'google'
        }
      ];

      return {
        success: true,
        events: googleEvents
      };
    } catch (error) {
      console.error('Error listing Google events:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create event in Google Calendar
  async createGoogleEvent(eventData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock event creation
      const createdEvent = {
        id: `google_event_${Date.now()}`,
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.startDateTime },
        end: { dateTime: eventData.endDateTime },
        location: eventData.location,
        attendees: eventData.attendees || [],
        source: 'google'
      };

      return {
        success: true,
        event: createdEvent
      };
    } catch (error) {
      console.error('Error creating Google event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update event in Google Calendar
  async updateGoogleEvent(eventId, eventData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock event update
      const updatedEvent = {
        id: eventId,
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.startDateTime },
        end: { dateTime: eventData.endDateTime },
        location: eventData.location,
        attendees: eventData.attendees || [],
        source: 'google'
      };

      return {
        success: true,
        event: updatedEvent
      };
    } catch (error) {
      console.error('Error updating Google event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete event from Google Calendar
  async deleteGoogleEvent(eventId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: 'Event deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting Google event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Sync local events with Google Calendar
  async syncWithGoogleCalendar(localEvents) {
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const syncResults = {
        created: 2,
        updated: 1,
        deleted: 0,
        errors: 0
      };

      return {
        success: true,
        syncResults
      };
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get project milestones for calendar display
  async getProjectMilestones() {
    try {
      // Get milestones from projects (mock data)
      const milestones = [
        {
          id: 'milestone_1',
          title: 'Design Phase Complete',
          project: 'E-commerce Website Redesign',
          client: 'TechStart Inc.',
          date: '2024-02-25',
          status: 'pending',
          priority: 'high',
          type: 'milestone'
        },
        {
          id: 'milestone_2',
          title: 'Brand Guidelines Delivery',
          project: 'Brand Identity Package',
          client: 'Design Studio Pro',
          date: '2024-02-28',
          status: 'pending',
          priority: 'high',
          type: 'milestone'
        },
        {
          id: 'milestone_3',
          title: 'App Beta Release',
          project: 'Mobile App Development',
          client: 'Startup Ventures',
          date: '2024-03-05',
          status: 'pending',
          priority: 'medium',
          type: 'milestone'
        }
      ];

      return {
        success: true,
        milestones
      };
    } catch (error) {
      console.error('Error getting project milestones:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get upcoming deadlines
  async getUpcomingDeadlines(days = 7) {
    try {
      const today = new Date();
      const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));

      // Mock upcoming deadlines
      const deadlines = [
        {
          id: 'deadline_1',
          title: 'Invoice Payment Due',
          client: 'TechStart Inc.',
          date: '2024-02-20',
          type: 'payment',
          amount: 25000,
          priority: 'high',
          daysLeft: 5
        },
        {
          id: 'deadline_2',
          title: 'Project Delivery',
          client: 'Design Studio Pro',
          date: '2024-02-22',
          type: 'delivery',
          priority: 'high',
          daysLeft: 7
        },
        {
          id: 'deadline_3',
          title: 'Milestone Review',
          client: 'Startup Ventures',
          date: '2024-02-18',
          type: 'review',
          priority: 'medium',
          daysLeft: 3
        }
      ];

      return {
        success: true,
        deadlines
      };
    } catch (error) {
      console.error('Error getting upcoming deadlines:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send calendar invite via email
  async sendCalendarInvite(eventData, attendees) {
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock email sending
      const inviteResult = {
        id: `invite_${Date.now()}`,
        event_id: eventData.id,
        attendees: attendees,
        sent_at: new Date().toISOString(),
        status: 'sent'
      };

      return {
        success: true,
        inviteResult
      };
    } catch (error) {
      console.error('Error sending calendar invite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create recurring event
  async createRecurringEvent(eventData, recurrenceRule) {
    try {
      // Simulate recurring event creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const recurringEvent = {
        id: `recurring_${Date.now()}`,
        ...eventData,
        recurrence: recurrenceRule,
        instances: this.generateRecurringInstances(eventData, recurrenceRule)
      };

      return {
        success: true,
        event: recurringEvent
      };
    } catch (error) {
      console.error('Error creating recurring event:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate recurring event instances
  generateRecurringInstances(eventData, recurrenceRule) {
    const instances = [];
    const startDate = new Date(eventData.date);
    const endDate = new Date(recurrenceRule.until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));

    let currentDate = new Date(startDate);
    let instanceCount = 0;
    const maxInstances = recurrenceRule.count || 52; // Default to 52 weeks

    while (currentDate <= endDate && instanceCount < maxInstances) {
      instances.push({
        id: `${eventData.id}_${instanceCount}`,
        ...eventData,
        date: currentDate.toISOString().split('T')[0],
        isRecurring: true,
        parentId: eventData.id
      });

      // Calculate next occurrence based on frequency
      switch (recurrenceRule.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + (recurrenceRule.interval || 1));
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * (recurrenceRule.interval || 1)));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + (recurrenceRule.interval || 1));
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + (recurrenceRule.interval || 1));
          break;
        default:
          break;
      }

      instanceCount++;
    }

    return instances;
  },

  // Get calendar analytics
  async getCalendarAnalytics() {
    try {
      // Mock analytics data
      const analytics = {
        totalEvents: 15,
        upcomingEvents: 8,
        completedEvents: 7,
        missedDeadlines: 1,
        averageEventsPerWeek: 3.5,
        eventTypes: {
          meetings: 6,
          deadlines: 4,
          milestones: 3,
          reviews: 2
        },
        clientActivity: {
          'TechStart Inc.': 5,
          'Design Studio Pro': 4,
          'Startup Ventures': 3,
          'Enterprise Corp': 2,
          'Creative Agency': 1
        },
        productivityScore: 85
      };

      return {
        success: true,
        analytics
      };
    } catch (error) {
      console.error('Error getting calendar analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check for conflicts in schedule
  checkScheduleConflicts(newEvent, existingEvents) {
    const newStart = new Date(`${newEvent.date}T${newEvent.time}`);
    const newEnd = new Date(newStart.getTime() + (newEvent.duration * 60 * 1000));

    const conflicts = existingEvents.filter(event => {
      const eventStart = new Date(`${event.date}T${event.time}`);
      const eventEnd = new Date(eventStart.getTime() + (event.duration * 60 * 1000));

      return (newStart < eventEnd && newEnd > eventStart);
    });

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }
};

export default calendarService;

