/**
 * History component for displaying tantrum session timeline
 * Shows last 14 sessions with derived metrics and triggers
 */

import { localStore } from '../util/local_store';
import type { TantrumSession } from '../util/local_store';
import { copy } from './copy';

export interface HistoryHandle {
  mount(container: HTMLElement): void;
  refresh(): Promise<void>;
  destroy(): void;
}

export function createHistory(): HistoryHandle {
  let root: HTMLElement;
  let sessions: TantrumSession[] = [];

  function mount(container: HTMLElement) {
    container.innerHTML = '';
    root = document.createElement('div');
    root.className = 'history';
    root.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      max-height: 400px;
      overflow-y: auto;
    `;

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Recent Sessions (Last 14)';
    title.style.cssText = `
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    `;
    root.appendChild(title);

    // Stats summary
    const statsContainer = document.createElement('div');
    statsContainer.className = 'history-stats';
    statsContainer.style.cssText = `
      display: flex;
      gap: 16px;
      padding: 12px;
      background: white;
      border-radius: 6px;
      font-size: 14px;
    `;
    root.appendChild(statsContainer);

    // Sessions container
    const sessionsContainer = document.createElement('div');
    sessionsContainer.className = 'history-sessions';
    sessionsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    root.appendChild(sessionsContainer);

    container.appendChild(root);
    refresh();
  }

  async function refresh() {
    try {
      sessions = await localStore.getSessions();
      renderStats();
      renderSessions();
    } catch (error) {
      console.error('Error loading history:', error);
      renderError();
    }
  }

  function renderStats() {
    const statsContainer = root.querySelector('.history-stats') as HTMLElement;
    if (!statsContainer) return;

    const stats = {
      total: sessions.length,
      avg_intensity: sessions.length > 0 
        ? Math.round(sessions.reduce((sum, s) => sum + (s.intensity_1_10 || 0), 0) / sessions.length * 10) / 10
        : 0,
      most_common_trigger: getMostCommonTrigger()
    };

    statsContainer.innerHTML = `
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #2196F3;">${stats.total}</div>
        <div style="font-size: 12px; color: #666;">Sessions</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #FF9800;">${stats.avg_intensity}</div>
        <div style="font-size: 12px; color: #666;">Avg Intensity</div>
      </div>
      <div style="flex: 1; text-align: center;">
        <div style="font-weight: bold; color: #4CAF50;">${stats.most_common_trigger || '—'}</div>
        <div style="font-size: 12px; color: #666;">Top Trigger</div>
      </div>
    `;
  }

  function getMostCommonTrigger(): string | null {
    const triggers = sessions
      .map(s => s.trigger)
      .filter(t => t !== undefined) as string[];
    
    if (triggers.length === 0) return null;

    const counts = triggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  function renderSessions() {
    const sessionsContainer = root.querySelector('.history-sessions') as HTMLElement;
    if (!sessionsContainer) return;

    if (sessions.length === 0) {
      sessionsContainer.innerHTML = `
        <div style="text-align: center; padding: 32px; color: #666; font-style: italic;">
          ${copy.empty.noSessionsYet}
        </div>
      `;
      return;
    }

    sessionsContainer.innerHTML = sessions.map(session => {
      const date = new Date(session.ts);
      const timeAgo = getTimeAgo(date);
      const intensity = session.intensity_1_10 || 0;
      const escalation = session.escalation_index || 0;
      
      const intensityColor = intensity <= 3 ? '#4CAF50' : intensity <= 6 ? '#FF9800' : '#F44336';
      const escalationColor = escalation <= 0.3 ? '#4CAF50' : escalation <= 0.7 ? '#FF9800' : '#F44336';

      return `
        <div class="session-item" style="
          background: white;
          border-radius: 6px;
          padding: 12px;
          border-left: 4px solid ${intensityColor};
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 600; color: #333;">${formatDate(date)}</div>
            <div style="font-size: 12px; color: #666;">${timeAgo}</div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-bottom: 8px;">
            ${session.trigger ? `
              <div style="
                background: #e3f2fd;
                color: #1976d2;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                ${session.trigger}
              </div>
            ` : ''}
            
            ${intensity > 0 ? `
              <div style="
                background: ${intensityColor}20;
                color: ${intensityColor};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                Intensity: ${intensity}/10
              </div>
            ` : ''}
            
            ${escalation > 0 ? `
              <div style="
                background: ${escalationColor}20;
                color: ${escalationColor};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                Escalation: ${Math.round(escalation * 100)}%
              </div>
            ` : ''}
          </div>
          
          ${session.duration_min ? `
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Duration: ${session.duration_min} minutes
            </div>
          ` : ''}
          
          ${session.notes ? `
            <div style="
              font-size: 12px;
              color: #555;
              font-style: italic;
              background: #f9f9f9;
              padding: 6px 8px;
              border-radius: 4px;
              margin-top: 4px;
            ">
              "${session.notes}"
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  function renderError() {
    const sessionsContainer = root.querySelector('.history-sessions') as HTMLElement;
    if (!sessionsContainer) return;

    sessionsContainer.innerHTML = `
      <div style="text-align: center; padding: 32px; color: #f44336; font-style: italic;">
        Error loading history. Please try again.
      </div>
    `;
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function destroy() {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }

  return {
    mount,
    refresh,
    destroy
  };
} 