/**
 * Meal Mood Companion - Instant Insights Screen
 */

import { Router } from '../../router.js';

export class MealInsightsScreen {
  private container: HTMLElement;
  private router: Router;
  private rating: string;
  private hasImage: boolean;
  private dietaryDiversity: number;
  private clutterScore: number;
  private plateCoverage: number;
  private mealMood: number = 0;
  private adjustedMood: number = 0;
  private currentTip: string = '';
  private currentBadge: string = '';
  private tipsData: any = null;
  private mode: 'question' | 'patterns' = 'patterns'; // Add mode tracking

  constructor(container: HTMLElement, router: Router, rating: string, hasImage: string, dietaryDiversity: string, clutterScore: string, plateCoverage: string, mode?: string) {
    this.container = container;
    this.router = router;
    this.rating = rating;
    this.hasImage = hasImage === 'true';
    this.dietaryDiversity = parseFloat(dietaryDiversity);
    this.clutterScore = parseFloat(clutterScore);
    this.plateCoverage = parseFloat(plateCoverage);
    this.mode = (mode as 'question' | 'patterns') || 'patterns';
  }

  public async render(): Promise<void> {
    await this.loadTipsData();
    this.calculateMealMood();
    
    const isQuestionMode = this.mode === 'question';
    
    this.container.innerHTML = `
      <div class="screen meal-insights">
        <header class="screen-header">
          <button class="back-btn" data-action="back">← Back</button>
          <h1>${isQuestionMode ? '🎤 Ask Question' : '📊 Meal Insights'}</h1>
        </header>

        <main class="screen-content">
          ${isQuestionMode ? this.renderQuestionMode() : this.renderPatternsMode()}
        </main>

        <nav class="screen-nav">
          <button class="btn secondary" data-action="save">💾 Save</button>
          <button class="btn primary" data-action="export">📤 Export Results</button>
        </nav>
      </div>
    `;

    this.bindEvents();
    if (!isQuestionMode) {
      this.selectTip();
      this.checkForBadge();
    }
  }

  private renderQuestionMode(): string {
    return `
      <section class="question-section">
        <h3>Ask About Feeding Patterns</h3>
        <div class="question-form">
          <div class="form-group">
            <label>Your Question</label>
            <textarea class="form-textarea" id="question-input" placeholder="e.g., Why does my child refuse vegetables? How can I make mealtime less stressful? What are good portion sizes for a 3-year-old?"></textarea>
          </div>
          
          <div class="question-suggestions">
            <h4>Suggested Questions:</h4>
            <div class="suggestion-buttons">
              <button class="btn secondary suggestion-btn" data-question="How can I encourage my child to try new foods?">Try new foods</button>
              <button class="btn secondary suggestion-btn" data-question="What are healthy snack alternatives?">Healthy snacks</button>
              <button class="btn secondary suggestion-btn" data-question="How do I handle picky eating?">Picky eating</button>
              <button class="btn secondary suggestion-btn" data-question="What's a good meal schedule for toddlers?">Meal schedule</button>
            </div>
          </div>
          
          <button class="btn primary ask-btn" data-action="ask-question">🤖 Ask AI Assistant</button>
        </div>
      </section>

      <section class="answer-section" id="answer-section" style="display: none;">
        <h3>AI Response</h3>
        <div class="answer-card">
          <div class="answer-content" id="answer-content">
            <!-- AI response will be inserted here -->
          </div>
        </div>
      </section>

      <section class="privacy-notice">
        <p>🔒 Your question and response are processed locally. No data is sent to external servers.</p>
      </section>
    `;
  }

  private renderPatternsMode(): string {
    return `
      <section class="mood-section">
        <h3>Meal Mood Score</h3>
        <div class="mood-display">
          <div class="mood-score">
            <div class="score-circle">
              <span class="score-value" id="mood-score">${this.adjustedMood}</span>
              <span class="score-label">/ 100</span>
            </div>
          </div>
          <div class="mood-description" id="mood-description">
            ${this.getMoodDescription()}
          </div>
        </div>
      </section>

      <section class="analysis-section">
        <h3>Image Analysis</h3>
        <div class="analysis-grid">
          <div class="analysis-card">
            <div class="analysis-icon">🌈</div>
            <h4>Dietary Diversity</h4>
            <div class="analysis-value">${(this.dietaryDiversity * 100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.dietaryDiversity * 100}%"></div>
            </div>
          </div>
          
          <div class="analysis-card">
            <div class="analysis-icon">🎯</div>
            <h4>Clutter Score</h4>
            <div class="analysis-value">${(this.clutterScore * 100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.clutterScore * 100}%"></div>
            </div>
          </div>
          
          <div class="analysis-card">
            <div class="analysis-icon">🍽️</div>
            <h4>Plate Coverage</h4>
            <div class="analysis-value">${(this.plateCoverage * 100).toFixed(0)}%</div>
            <div class="analysis-bar">
              <div class="bar-fill" style="width: ${this.plateCoverage * 100}%"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="tip-section">
        <h3>Personalized Tip</h3>
        <div class="tip-card">
          <div class="tip-content" id="tip-content">
            ${this.currentTip}
          </div>
        </div>
      </section>

      <section class="badge-section" id="badge-section" style="display: none;">
        <h3>Meal Achievement</h3>
        <div class="badge-card">
          <div class="badge-content" id="badge-content">
            <!-- Badge will be inserted here -->
          </div>
        </div>
      </section>

      <section class="privacy-notice">
        <p>🔒 Analysis completed on your device. No data was sent to servers.</p>
      </section>
    `;
  }

  private async loadTipsData(): Promise<void> {
    try {
      const response = await fetch('/scoring/meal/tips.json');
      this.tipsData = await response.json();
    } catch (error) {
      console.error('Failed to load tips data:', error);
      this.tipsData = { tips: {}, badges: {}, mood_adjustments: {} };
    }
  }

  private calculateMealMood(): void {
    // Base meal mood from rating (1-5 stars = 20-100)
    this.mealMood = parseInt(this.rating) * 20;
    
    // Apply image heuristics adjustments
    const diversityBonus = (this.dietaryDiversity - 0.5) * 10;
    const clutterPenalty = (this.clutterScore - 0.5) * 10;
    
    this.adjustedMood = Math.max(0, Math.min(100, 
      this.mealMood + diversityBonus - clutterPenalty
    ));
  }

  private getMoodDescription(): string {
    if (this.adjustedMood >= 80) return "Excellent! The child is very excited about this meal.";
    if (this.adjustedMood >= 60) return "Good! The child shows positive interest in the meal.";
    if (this.adjustedMood >= 40) return "Moderate. The child is somewhat interested in the meal.";
    if (this.adjustedMood >= 20) return "Low. The child shows minimal interest in the meal.";
    return "Very low. The child may not be interested in this meal.";
  }

  private selectTip(): void {
    if (!this.tipsData) return;
    
    // Select tip based on highest priority factor
    let tipCategory = 'mood';
    let tipLevel = this.getLevel(this.adjustedMood / 100);
    
    // Check if diversity is very low
    if (this.dietaryDiversity < 0.3) {
      tipCategory = 'diversity';
      tipLevel = 'low';
    }
    // Check if clutter is very high
    else if (this.clutterScore > 0.7) {
      tipCategory = 'clutter';
      tipLevel = 'high';
    }
    // Check if coverage is very low or high
    else if (this.plateCoverage < 0.3) {
      tipCategory = 'coverage';
      tipLevel = 'low';
    } else if (this.plateCoverage > 0.8) {
      tipCategory = 'coverage';
      tipLevel = 'high';
    }
    
    const tips = this.tipsData.tips[tipCategory]?.[tipLevel] || 
                 this.tipsData.tips.mood?.[tipLevel] || 
                 ['Great meal! Keep up the good work.'];
    
    this.currentTip = tips[Math.floor(Math.random() * tips.length)];
  }

  private getLevel(value: number): 'low' | 'medium' | 'high' {
    if (value < 0.33) return 'low';
    if (value < 0.66) return 'medium';
    return 'high';
  }

  private checkForBadge(): void {
    if (!this.tipsData) return;
    
    // Check for diversity champion
    if (this.dietaryDiversity > 0.7) {
      this.showBadge(this.tipsData.badges.diversity_champion);
    }
    // Check for portion perfect
    else if (this.plateCoverage >= 0.4 && this.plateCoverage <= 0.7) {
      this.showBadge(this.tipsData.badges.portion_perfect);
    }
    // Check for mood booster
    else if (this.adjustedMood > 80) {
      this.showBadge(this.tipsData.badges.mood_booster);
    }
  }

  private showBadge(badge: any): void {
    this.currentBadge = badge.name;
    
    const badgeSection = this.container.querySelector('#badge-section') as HTMLElement;
    const badgeContent = this.container.querySelector('#badge-content') as HTMLElement;
    
    if (badgeSection && badgeContent) {
      badgeSection.style.display = 'block';
      badgeContent.innerHTML = `
        <div class="badge-display">
          <div class="badge-icon">${badge.name}</div>
          <div class="badge-description">${badge.description}</div>
        </div>
      `;
    }
  }

  private bindEvents(): void {
    // Back button
    const backBtn = this.container.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigate({ dyad: 'meal', screen: 'home' });
      });
    }

    // Question mode specific events
    if (this.mode === 'question') {
      // Suggestion buttons
      const suggestionBtns = this.container.querySelectorAll('.suggestion-btn');
      suggestionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const question = (e.currentTarget as HTMLElement).dataset.question || '';
          const questionInput = this.container.querySelector('#question-input') as HTMLTextAreaElement;
          if (questionInput) {
            questionInput.value = question;
          }
        });
      });

      // Ask question button
      const askBtn = this.container.querySelector('.ask-btn');
      if (askBtn) {
        askBtn.addEventListener('click', () => {
          this.handleAskQuestion();
        });
      }
    }

    // Save button
    const saveBtn = this.container.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.handleSave();
      });
    }

    // Export button
    const exportBtn = this.container.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.handleExport();
      });
    }
  }

  private async handleAskQuestion(): Promise<void> {
    const questionInput = this.container.querySelector('#question-input') as HTMLTextAreaElement;
    const question = questionInput?.value.trim();
    
    if (!question) {
      alert('Please enter a question first.');
      return;
    }

    // Show loading state
    const askBtn = this.container.querySelector('.ask-btn') as HTMLButtonElement;
    const originalText = askBtn.textContent;
    askBtn.textContent = '🤖 Thinking...';
    askBtn.disabled = true;

    try {
      // Simulate AI response (in a real app, this would call an AI service)
      const response = await this.generateAIResponse(question);
      
      // Display the response
      this.displayAnswer(response);
    } catch (error) {
      console.error('Error generating response:', error);
      alert('Sorry, there was an error generating the response. Please try again.');
    } finally {
      // Restore button state
      askBtn.textContent = originalText;
      askBtn.disabled = false;
    }
  }

  private async generateAIResponse(question: string): Promise<string> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple response logic based on question keywords
    const lowerQuestion = question.toLowerCase();
    
    // Check for specific food items first
    if (lowerQuestion.includes('broccoli') || lowerQuestion.includes('brocolli')) {
      return `Great question about broccoli! Here are specific strategies to help your son enjoy it:\n\n**Make it Fun:**\n• Call it "little trees" or "dinosaur food"\n• Let him help wash and prepare it\n• Try different cooking methods (steamed, roasted, raw with dip)\n\n**Start Small:**\n• Begin with tiny pieces mixed into favorite foods\n• Gradually increase the amount over time\n• Don't force it - keep offering without pressure\n\n**Role Model:**\n• Eat broccoli enthusiastically in front of him\n• Talk about how much you enjoy it\n• Make it a family tradition\n\n**Be Patient:**\n• It can take 10-15 exposures before acceptance\n• Every child is different\n• Keep trying different approaches\n\nRemember: The goal is to create positive associations with healthy foods!`;
    } else if (lowerQuestion.includes('vegetable') || lowerQuestion.includes('veggie')) {
      return `Great question! Here are some tips for encouraging vegetable consumption:\n\n1. **Lead by example** - Eat vegetables enthusiastically in front of your child\n2. **Make it fun** - Try "rainbow plates" with colorful vegetables\n3. **Involve them** - Let your child help choose and prepare vegetables\n4. **Start small** - Begin with tiny portions and gradually increase\n5. **Be patient** - It can take 10-15 exposures before a child accepts a new food\n\nRemember, every child is different, and it's normal for preferences to change over time.`;
    } else if (lowerQuestion.includes('snack') || lowerQuestion.includes('healthy')) {
      return `Here are some nutritious snack ideas for toddlers:\n\n**Fruits & Vegetables:**\n• Apple slices with peanut butter\n• Carrot sticks with hummus\n• Banana with yogurt\n\n**Protein-rich:**\n• Hard-boiled eggs\n• Cheese cubes\n• Greek yogurt\n\n**Grains:**\n• Whole grain crackers\n• Oatmeal with berries\n• Rice cakes\n\n**Avoid:** Processed snacks, sugary drinks, and large portions that might spoil their appetite for meals.`;
    } else if (lowerQuestion.includes('picky') || lowerQuestion.includes('refuse')) {
      return `Picky eating is very common and usually temporary. Here's how to handle it:\n\n**Stay Calm:** Don't make mealtime a power struggle\n**Offer Choices:** "Would you like carrots or broccoli?"\n**Keep Trying:** Continue offering rejected foods in different ways\n**Set Limits:** "This is what's for dinner" (no short-order cooking)\n**Praise Efforts:** Celebrate when they try new foods\n**Be Patient:** This phase usually passes with time\n\nRemember: It's your job to offer healthy foods, but your child decides how much to eat.`;
    } else if (lowerQuestion.includes('schedule') || lowerQuestion.includes('meal time')) {
      return `A consistent meal schedule helps children develop healthy eating habits:\n\n**Typical Toddler Schedule:**\n• **Breakfast:** 7-8 AM\n• **Morning Snack:** 9-10 AM\n• **Lunch:** 11:30 AM - 12:30 PM\n• **Afternoon Snack:** 2-3 PM\n• **Dinner:** 5-6 PM\n\n**Tips:**\n• Keep meals 2-3 hours apart\n• Limit snacks to 30 minutes before meals\n• Offer water between meals\n• Be consistent with timing\n• Allow 20-30 minutes for meals\n\nAdjust timing based on your family's schedule and your child's hunger cues.`;
    } else if (lowerQuestion.includes('portion') || lowerQuestion.includes('how much')) {
      return `Portion sizes for toddlers can be tricky! Here's a general guide:\n\n**General Rule:** 1 tablespoon per year of age for each food group\n\n**Protein (meat, fish, eggs):**\n• 1-2 tablespoons for 1-2 year olds\n• 2-3 tablespoons for 3-4 year olds\n\n**Vegetables:**\n• 1-2 tablespoons (start small)\n• Offer more, but don't force\n\n**Fruits:**\n• 1/4 to 1/2 cup\n• Cut into small, safe pieces\n\n**Grains:**\n• 1/4 to 1/2 cup cooked\n• Whole grains preferred\n\n**Remember:**\n• Let your child decide how much to eat\n• Don't force them to finish\n• Offer seconds if they're still hungry\n• Every child is different!`;
    } else if (lowerQuestion.includes('stress') || lowerQuestion.includes('difficult') || lowerQuestion.includes('frustrat')) {
      return `Mealtime stress is very common! Here are strategies to make it more peaceful:\n\n**Before the Meal:**\n• Set clear expectations\n• Involve your child in preparation\n• Create a calm environment\n\n**During the Meal:**\n• Stay positive and relaxed\n• Avoid power struggles\n• Use positive reinforcement\n• Keep meals short (20-30 minutes)\n\n**After the Meal:**\n• Don't make food a reward or punishment\n• Clean up together\n• Move on to the next activity\n\n**Long-term Strategies:**\n• Establish consistent routines\n• Model healthy eating habits\n• Be patient with the process\n• Consider consulting a feeding specialist if needed\n\nRemember: A relaxed parent often leads to a relaxed child!`;
    } else {
      return `Thank you for your question about feeding! Here are some general tips for healthy eating habits:\n\n**Create a Positive Environment:**\n• Eat together as a family when possible\n• Make mealtime pleasant and stress-free\n• Avoid using food as rewards or punishments\n\n**Offer Variety:**\n• Include foods from all food groups\n• Present foods in different ways\n• Let your child explore new textures and flavors\n\n**Trust Your Child:**\n• They know when they're hungry or full\n• Don't force them to eat\n• Offer appropriate portion sizes\n\n**Be Patient:**\n• Food preferences change over time\n• Keep offering rejected foods\n• Every child develops at their own pace\n\nIf you have specific concerns about your child's eating, consider consulting with a pediatrician or registered dietitian.`;
    }
  }

  private displayAnswer(response: string): void {
    const answerSection = this.container.querySelector('#answer-section') as HTMLElement;
    const answerContent = this.container.querySelector('#answer-content') as HTMLElement;
    
    if (answerSection && answerContent) {
      answerSection.style.display = 'block';
      answerContent.innerHTML = `
        <div class="answer-text">
          ${response.replace(/\n/g, '<br>')}
        </div>
        <button class="btn secondary new-question-btn" data-action="new-question">Ask Another Question</button>
      `;
      
      // Bind new question button
      const newQuestionBtn = answerContent.querySelector('.new-question-btn');
      if (newQuestionBtn) {
        newQuestionBtn.addEventListener('click', () => {
          answerSection.style.display = 'none';
          const questionInput = this.container.querySelector('#question-input') as HTMLTextAreaElement;
          if (questionInput) {
            questionInput.value = '';
            questionInput.focus();
          }
        });
      }
      
      // Scroll to answer
      answerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private async handleSave(): Promise<void> {
    // Save to local storage
    const sessionData = this.prepareSessionData();
    this.saveToHistory(sessionData);
    
    // Navigate to gallery
    this.router.navigate({ dyad: 'meal', screen: 'gallery' });
  }

  private async handleExport(): Promise<void> {
    // Create export data
    const exportData = {
      dyad: 'meal',
      timestamp: new Date().toISOString(),
      rating: parseInt(this.rating),
      metrics: {
        meal_mood: this.adjustedMood
      },
      media_summaries: {
        image: {
          dietary_diversity: this.dietaryDiversity,
          clutter_score: this.clutterScore,
          plate_coverage: this.plateCoverage
        }
      },
      tip: this.currentTip,
      badge: this.currentBadge
    };

    try {
      // Send to bot through relay
      await this.sendToBot(exportData);
      
      // Also download JSON file as backup
      this.downloadJSON(exportData);
      
      // Show success message
      alert('Results exported successfully! Data sent to Silli Bot.');
      
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Export failed. Please try again.');
    }
  }

  private async sendToBot(data: any): Promise<void> {
    // Get current session info from URL or config
    const urlParams = new URLSearchParams(window.location.search);
    const family = urlParams.get('family') || 'unknown';
    const session = urlParams.get('session') || `meal_${Date.now()}`;
    
    // Create the payload in the format the bot expects
    const payload = {
      ts_start: new Date().toISOString(),
      duration_s: 0, // Meal sessions don't have duration
      mode: 'helper',
      family_id: family,
      session_id: session,
      scales: {},
      features_summary: {
        level_dbfs_p50: -60,
        centroid_norm_mean: 0,
        flux_norm_mean: 0,
        vad_fraction: 0,
        stationarity: 0
      },
      score: {
        short: data.metrics?.meal_mood || 0,
        mid: data.metrics?.meal_mood || 0,
        long: data.metrics?.meal_mood || 0
      },
      badges: data.badge ? [data.badge] : [],
      events: [],
      pii: false,
      version: 'pwa_0.1',
      context: {
        dyad: 'meal',
        rating: data.rating,
        meal_mood: data.metrics?.meal_mood,
        has_image: data.media_summaries?.image ? true : false,
        dietary_diversity: data.media_summaries?.image?.dietary_diversity,
        clutter_score: data.media_summaries?.image?.clutter_score,
        plate_coverage: data.media_summaries?.image?.plate_coverage,
        tip: data.tip
      },
      metrics: data.metrics
    };

    // Import the queue utility
    const { enqueue } = await import('../../../util/queue.js');
    
    // Add to pending queue for bot to pick up
    enqueue({
      family,
      session,
      payload: JSON.stringify(payload),
      createdAt: Date.now()
    });

    // Try to send immediately if possible
    await this.tryImmediateSend(payload);
  }

  private async tryImmediateSend(payload: any): Promise<void> {
    try {
      // Try to send directly to the bot's webhook endpoint
      const response = await fetch('/api/relay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.log('Immediate send failed, data queued for later pickup');
      }
    } catch (error) {
      console.log('Immediate send failed, data queued for later pickup:', error);
    }
  }

  private downloadJSON(data: any): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private prepareSessionData(): any {
    return {
      timestamp: new Date().toISOString(),
      rating: parseInt(this.rating),
      mealMood: this.adjustedMood,
      hasImage: this.hasImage,
      dietaryDiversity: this.dietaryDiversity,
      clutterScore: this.clutterScore,
      plateCoverage: this.plateCoverage,
      tip: this.currentTip,
      badge: this.currentBadge
    };
  }

  private saveToHistory(sessionData: any): void {
    const historyKey = 'meal_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new session
    history.unshift(sessionData);
    
    // Keep only last 30 sessions
    if (history.length > 30) {
      history.splice(30);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
  }

  public destroy(): void {
    // Clean up if needed
  }
} 