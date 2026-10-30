import React from 'react';
import { 
  X, 
  Volume2, 
  Eye, 
  Sliders, 
  Sparkles, 
  VolumeX, 
  Check, 
  Type, 
  SunMoon, 
  Radio
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function AccessibilityModal({ isOpen, onClose, onTestSpeech }) {
  const {
    voiceEnabled,
    setVoiceEnabled,
    speechSpeed,
    setSpeechSpeed,
    voiceVolume,
    setVoiceVolume,
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    simplifiedMode,
    setSimplifiedMode,
    autoPageRead,
    setAutoPageRead,
    soundEffectsEnabled,
    setSoundEffectsEnabled,
    announce
  } = useAccessibility();

  if (!isOpen) return null;

  const handleTestVoice = () => {
    if (onTestSpeech) {
      onTestSpeech("VoiceCart speech synthesis is active at speed " + speechSpeed + " and normal volume.");
    } else {
      announce("VoiceCart speech settings verified.", 'assertive');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-settings-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 id="accessibility-settings-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Accessibility Settings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                WCAG 2.2 AA compliant preferences for blind & low-vision shoppers
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-600"
            aria-label="Close accessibility settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          
          {/* 1. Voice Assistance Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <label htmlFor="voice-assistance-toggle" className="font-bold text-base text-slate-900 dark:text-white block cursor-pointer">
                Voice Assistant Speech
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speaks product details, cart status, totals, and voice feedback aloud
              </p>
            </div>
            <button
              id="voice-assistance-toggle"
              type="button"
              role="switch"
              aria-checked={voiceEnabled}
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                announce(`Voice Assistant ${!voiceEnabled ? 'enabled' : 'disabled'}`);
              }}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors focus:ring-2 focus:ring-green-600 ${
                voiceEnabled ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                voiceEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* 2. Speech Speed & Volume */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="speech-speed-slider" className="font-bold text-sm text-slate-900 dark:text-white">
                  Speech Speed ({speechSpeed}x)
                </label>
                <div className="flex gap-1.5">
                  {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setSpeechSpeed(speed)}
                      className={`px-2 py-0.5 text-xs rounded font-semibold ${
                        speechSpeed === speed
                          ? 'bg-green-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
              <input
                id="speech-speed-slider"
                type="range"
                min="0.75"
                max="1.75"
                step="0.25"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-green-600 cursor-pointer"
                aria-valuemin="0.75"
                aria-valuemax="1.75"
                aria-valuenow={speechSpeed}
              />
            </div>

            {/* Voice Volume */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="voice-volume-slider" className="font-bold text-sm text-slate-900 dark:text-white">
                  Voice Volume ({Math.round(voiceVolume * 100)}%)
                </label>
              </div>
              <input
                id="voice-volume-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                className="w-full accent-green-600 cursor-pointer"
                aria-valuenow={voiceVolume}
              />
            </div>

            <button
              type="button"
              onClick={handleTestVoice}
              className="text-xs font-bold text-green-700 dark:text-green-400 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Current Speech</span>
            </button>
          </div>

          {/* 3. High Contrast Mode Selection */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white block">
              High Contrast Color Theme
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setContrastMode('default')}
                className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 ${
                  contrastMode === 'default'
                    ? 'border-green-600 bg-white dark:bg-slate-700 text-green-800 dark:text-white ring-2 ring-green-600/30'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300" />
                <span>Standard</span>
              </button>

              <button
                type="button"
                onClick={() => setContrastMode('high-contrast-dark')}
                className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 ${
                  contrastMode === 'high-contrast-dark'
                    ? 'border-green-600 bg-black text-white ring-2 ring-green-600/30'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-black border border-white" />
                <span>High Dark</span>
              </button>

              <button
                type="button"
                onClick={() => setContrastMode('yellow-black')}
                className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1.5 ${
                  contrastMode === 'yellow-black'
                    ? 'border-yellow-400 bg-black text-yellow-300 ring-2 ring-yellow-400/30'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-black border-2 border-yellow-400" />
                <span>Yellow on Black</span>
              </button>
            </div>
          </div>

          {/* 4. Font Size Adjustment */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white block">
              Readable Font Size
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Default (16px)' },
                { id: 'large', label: 'Large (18px)' },
                { id: 'xlarge', label: 'Extra Large (20px)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontSize(f.id)}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center ${
                    fontSize === f.id
                      ? 'border-green-600 bg-green-50 dark:bg-green-950/60 text-green-900 dark:text-green-100 ring-2 ring-green-600/30'
                      : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Simplified Interface Mode */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <label htmlFor="simplified-mode-toggle" className="font-bold text-base text-slate-900 dark:text-white block cursor-pointer">
                Simplified Interface
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Removes decorative banners and keeps essential high-contrast controls
              </p>
            </div>
            <button
              id="simplified-mode-toggle"
              type="button"
              role="switch"
              aria-checked={simplifiedMode}
              onClick={() => {
                setSimplifiedMode(!simplifiedMode);
                announce(`Simplified interface ${!simplifiedMode ? 'enabled' : 'disabled'}`);
              }}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors focus:ring-2 focus:ring-green-600 ${
                simplifiedMode ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                simplifiedMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* 6. Automatic Page Reading on Focus */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <label htmlFor="auto-read-toggle" className="font-bold text-base text-slate-900 dark:text-white block cursor-pointer">
                Automatic Product Reading
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatically speaks product price and title when tabbed onto using keyboard
              </p>
            </div>
            <button
              id="auto-read-toggle"
              type="button"
              role="switch"
              aria-checked={autoPageRead}
              onClick={() => {
                setAutoPageRead(!autoPageRead);
                announce(`Automatic product reading ${!autoPageRead ? 'enabled' : 'disabled'}`);
              }}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors focus:ring-2 focus:ring-green-600 ${
                autoPageRead ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                autoPageRead ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* 7. Sound Effects / Earcons */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <label htmlFor="sound-effects-toggle" className="font-bold text-base text-slate-900 dark:text-white block cursor-pointer">
                Auditory Cues (Earcons)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plays distinct chimes when mic starts, stops, or items are added
              </p>
            </div>
            <button
              id="sound-effects-toggle"
              type="button"
              role="switch"
              aria-checked={soundEffectsEnabled}
              onClick={() => {
                setSoundEffectsEnabled(!soundEffectsEnabled);
                announce(`Auditory cues ${!soundEffectsEnabled ? 'enabled' : 'disabled'}`);
              }}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors focus:ring-2 focus:ring-green-600 ${
                soundEffectsEnabled ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl shadow focus:ring-4 focus:ring-green-400"
          >
            Save & Close Settings
          </button>
        </div>

      </div>
    </div>
  );
}
