# Silli Meter PWA

A privacy-first Progressive Web App for child development tracking across multiple dyads (night, tantrum, meal).

## Payload Schema

All dyad exports follow this unified schema (v0.2), which is backwards-compatible with existing night helper data:

```typescript
interface PayloadSchema {
  version: "pwa_0.2";
  family_id: string;
  session_id: string;
  mode: "helper";
  dyad: "night" | "tantrum" | "meal";
  ts_start: string; // ISO timestamp
  duration_s: number;
  features_summary: { ... }; // Existing audio features
  score?: { short: number; mid: number; long: number; trend: string }; // Night only
  badges: string[]; // Dyad-specific badges
  context: { ... }; // Sparse; per-dyad fields
  metrics: { // Sparse
    escalation_index?: number; // Tantrum (0-1)
    meal_mood?: number; // Meal (0-100)
  };
  media_summaries: { // Sparse
    audio?: {
      rms_p50?: number;
      vad_fraction?: number;
    };
    video?: {
      motion_score_p95?: number;
    };
    image?: {
      dietary_diversity?: number; // 0-1
      clutter_score?: number; // 0-1
      plate_coverage?: number; // 0-1
    };
  };
  events: any[]; // Existing event log
  pii: false; // Always false for privacy
}
```

### Dyad-Specific Fields

#### Night Helper
```json
{
  "dyad": "night",
  "score": {
    "short": 85,
    "mid": 82,
    "long": 78,
    "trend": "improving"
  },
  "features_summary": {
    "vad_fraction": 0.12,
    "flux_norm": 0.08,
    "centroid_norm": 0.45
  },
  "context": {
    "duration_min": 15,
    "environment_noise": false
  }
}
```

#### Tantrum Translator
```json
{
  "dyad": "tantrum",
  "metrics": {
    "escalation_index": 0.65
  },
  "media_summaries": {
    "audio": {
      "rms_p50": 0.5,
      "vad_fraction": 0.3
    },
    "video": {
      "motion_score_p95": 0.7
    }
  },
  "context": {
    "trigger": "transition",
    "duration_min": 8,
    "co_regulation": ["mirror", "label"]
  },
  "badges": ["✅ Emotional Mirror"]
}
```

#### Meal Mood Companion
```json
{
  "dyad": "meal",
  "metrics": {
    "meal_mood": 75
  },
  "media_summaries": {
    "image": {
      "dietary_diversity": 0.65,
      "clutter_score": 0.32,
      "plate_coverage": 0.58
    }
  },
  "context": {
    "meal_type": "dinner",
    "eaten_pct": 80,
    "stress_level": 1
  },
  "badges": ["🌈 Diversity Champion"]
}
```

## Storage

The app uses a unified storage system that automatically switches between localStorage and IndexedDB based on data size:

- **localStorage**: Used when total data < 5MB
- **IndexedDB**: Automatically switched to when data exceeds 5MB
- **API**: `save(dyad, item)`, `list(dyad, limit)`, `clear(dyad)`

## Tips System

Each dyad has its own tips.json file with context-aware tip selection:

### Tantrum Tips
- **Categories**: `transition`, `frustration`, `limit`, `separation`, `unknown`
- **Levels**: `low`, `medium`, `high` (based on escalation_index)
- **Selection**: Trigger + escalation level

### Meal Tips
- **Categories**: `diversity`, `clutter`, `coverage`, `mood`
- **Levels**: `low`, `medium`, `high` (based on meal_mood)
- **Selection**: Priority-based (diversity → clutter → coverage → mood)

### Night Tips
- **Categories**: `quiet`, `speech`, `tv_music`, `white_noise`
- **Levels**: `low`, `medium`, `high` (based on score)
- **Selection**: Score-based category selection

## Share Cards

Each dyad generates share cards with:
- **Metric**: Dyad-specific score (sleep score, escalation level, meal mood)
- **Bullets**: Up to 2 context-aware insights
- **Format**: HTML with optional image export (requires html2canvas)

## Privacy

- All processing happens on-device
- No network calls during analysis
- Local storage only
- PII flag always set to `false`
- Clear privacy notices on all capture screens

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test URLs
http://localhost:5173/silli-meter/?dyad=night
http://localhost:5173/silli-meter/?dyad=tantrum
http://localhost:5173/silli-meter/?dyad=meal
```

## Architecture

- **Router**: Hash-based navigation with dyad/screen parameters
- **Storage**: Unified wrapper with automatic localStorage/IndexedDB switching
- **Scoring**: Dyad-specific tip selection and badge awarding
- **UI**: Modular screen components with consistent styling
- **Export**: Unified payload schema with dyad-specific extensions
