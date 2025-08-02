# Silli Parent Night Helper

Privacy-first parent helper for wind-down analysis. Performs on-device listening and analysis with no network calls during capture.

## Features

- **Helper Mode**: 5-10 minute continuous analysis with Wake Lock
- **Low-Power Mode**: 10s/30s periodic sampling
- **Real-time Scoring**: Uses calibrated weights from bot analysis
- **Local Processing**: All analysis runs on-device, no audio uploaded
- **Export**: Session JSON + PNG card generation

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Deep-link Parameters

- `?mode=helper|low_power` - Analysis mode
- `?family=fam_XXX` - Family identifier  
- `?session=session_id` - Session identifier

### Example URLs

- Helper mode: `/?mode=helper&family=fam_123&session=test_session`
- Low-power mode: `/?mode=low_power&family=fam_123&session=test_session`

## Privacy

All audio analysis runs locally on your device. No audio data is uploaded or transmitted to any server.

## Technical Details

- **Audio Processing**: AudioWorklet for real-time frame processing
- **Feature Extraction**: RMS, spectral centroid, rolloff, flux, VAD
- **Scoring**: Calibrated weights from bot analysis
- **Export**: Session JSON contract + PNG timeline cards 