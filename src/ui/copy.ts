/**
 * Centralized copy system for Silli PWA
 * Provides consistent, calm tone across all user-facing text
 */

export const copy = {
  // Privacy & Security
  privacy: {
    onDeviceProcessing: "All processing happens on your device. Nothing is sent to our servers.",
    localStorage: "Your data is stored locally on your device. You control what gets shared.",
    secureSharing: "When you choose to share, only summary data is sent via encrypted channels.",
    photosStayPrivate: "Photos stay private and are analyzed on your device only.",
    noCloudStorage: "All data stays on your device. No cloud storage.",
    analysisComplete: "Analysis completed on your device. No data was sent to servers.",
    recordingsNeverLeave: "Your recordings never leave your device.",
    photosAnalyzedLocally: "Your photos are analyzed on your device and never uploaded.",
    dataStaysLocal: "Photos and data stay on your device. No cloud storage.",
  },

  // Empty States
  empty: {
    noSessionsYet: "No sessions yet. Start tracking to see your history here.",
    noMealsYet: "No meals yet. Start logging to see your gallery here.",
    noDataYet: "No data yet. Begin tracking to see insights here.",
    noHistoryYet: "No history yet. Your sessions will appear here.",
    noGalleryYet: "No gallery yet. Your meal photos will appear here.",
  },

  // Button Labels
  buttons: {
    back: "← Back",
    cancel: "Cancel",
    done: "Done",
    save: "Save",
    saveMeal: "Save Meal",
    analyze: "Analyze",
    analyzeMeal: "Analyze Meal",
    export: "Export",
    exportAll: "Export All Data",
    clearData: "Clear All Data",
    share: "Share",
    newSession: "➕ New Session",
    newMeal: "➕ New Meal",
    exportResults: "📤 Export Results",
    uploadVoice: "Upload Voice",
    uploadVideo: "Upload Video",
    addText: "Add Text",
    snapMeal: "Snap Meal",
    askQuestion: "Ask a Question",
    logMeal: "Log Meal",
    viewPatterns: "View Patterns",
    recordSession: "Record Session",
    history: "History",
    gallery: "Gallery",
    settings: "Settings",
  },

  // Form Labels
  forms: {
    trigger: "Trigger",
    duration: "Duration (minutes)",
    coRegulation: "Co-regulation strategies",
    notes: "Notes (optional)",
    mealType: "Meal type",
    offered: "Offered",
    eatenPercent: "Eaten (%)",
    stressLevel: "Stress level",
    intensity: "Intensity",
    environmentNoise: "Environment noise",
    lightLevel: "Light level",
    temperature: "Temperature",
  },

  // Placeholders
  placeholders: {
    selectTrigger: "—",
    selectMealType: "—",
    enterOffered: "What was offered?",
    enterNotes: "Any observations...",
    enterNotesTantrum: "What happened? How did you respond?",
    enterNotesMeal: "Any observations about the meal...",
    processing: "Processing...",
    loading: "Loading...",
    loadingTip: "Loading tip...",
  },

  // Validation Messages
  validation: {
    required: "This field is required",
    invalidNumber: "Please enter a valid number",
    invalidPercentage: "Please enter a percentage between 0-100",
    invalidDuration: "Please enter a duration between 1-60 minutes",
    selectTrigger: "Please select a trigger",
    selectMealType: "Please select a meal type",
    enterOffered: "Please enter what was offered",
  },

  // Intensity Labels
  intensity: {
    mild: "1 - Mild",
    extreme: "10 - Extreme",
    calm: "Calm",
    rising: "Rising", 
    high: "High",
    moderate: "Moderate",
    intense: "Intense",
  },

  // Tab Labels
  tabs: {
    recordSession: "Record Session",
    history: "History",
  },

  // Media Processing
  media: {
    processingAudio: "Processing audio...",
    processingVideo: "Processing video...",
    duration: "Duration",
    level: "Level",
    motion: "Motion",
    seconds: "s",
    decibels: "dB",
    percent: "%",
  },

  // Co-regulation Options
  coRegulation: [
    { value: 'hold', label: 'Hold' },
    { value: 'mirror', label: 'Mirror' },
    { value: 'label', label: 'Label' },
    { value: 'breathe', label: 'Breathe' },
    { value: 'safe_space', label: 'Safe Space' },
    { value: 'low_stimulus', label: 'Low Stimulus' },
  ],

  // Meal Types
  mealTypes: [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'snack', label: 'Snack' },
    { value: 'dinner', label: 'Dinner' },
  ],

  // Triggers
  triggers: ['transition', 'frustration', 'limit', 'separation', 'unknown'],

  // Section Headers
  sections: {
    howIntense: "How intense is this moment?",
    howWouldYouLike: "How would you like to share?",
    howWasMeal: "How was this meal?",
    whatWouldYouLike: "What would you like to do?",
    quickActions: "Quick Actions",
    mealDetails: "Meal Details",
    sessionDetails: "Session Details",
    privacyAndData: "Privacy & Data",
    preferences: "Preferences",
    dataManagement: "Data Management",
    about: "About",
  },

  // Descriptions
  descriptions: {
    recordOrUpload: "Record or upload audio",
    recordOrUploadVideo: "Record or upload video",
    describeWhatHappened: "Describe what happened",
    takePhotoOfMeal: "Take a photo of the meal",
    getInsightsAboutFeeding: "Get insights about feeding",
    saveAnalysisResults: "Save analysis results automatically",
    displayInsightsAndTrends: "Display insights and trends",
    gentleRemindersToLog: "Gentle reminders to log sessions",
    saveMealLogs: "Save meal logs automatically",
    remindToTakePhotos: "Remind to take meal photos",
    showNutritionTips: "Show nutrition tips and patterns",
    selectRating: "Select a rating",
  },

  // App Info
  app: {
    tantrumTranslator: "Tantrum Translator",
    mealMoodCompanion: "Meal Mood Companion",
    understandBeneathSurface: "Understand what's happening beneath the surface",
    trackEatingPatterns: "Track and understand your child's eating patterns",
    version: "Version 1.0.0 • Built with ❤️ for families",
    helpingUnderstandEmotional: "Helping you understand your child's emotional world through gentle, privacy-first analysis.",
    helpingUnderstandEating: "Helping you understand your child's eating patterns through gentle, privacy-first tracking.",
  },
} as const;

export type CopyKey = keyof typeof copy; 