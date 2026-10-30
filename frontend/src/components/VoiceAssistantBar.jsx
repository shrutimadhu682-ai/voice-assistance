import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  HelpCircle, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Radio
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function VoiceAssistantBar({
  assistantState, // 'idle' | 'listening' | 'processing' | 'speaking'
  transcript,
  lastSpeech,
  onToggleListening,
  onStopSpeaking,
  onRepeatSpeech,
  onManualCommand,
  openHelpModal
}) {
  const { voiceEnabled, contrastMode } = useAccessibility();
  const [manualInput, setManualInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onManualCommand(manualInput.trim());
    setManualInput('');
  };

  const handlePillClick = (cmd) => {
    onManualCommand(cmd);
  };

  const quickCommands = [
    "Search for basmati rice",
    "Show vegetables",
    "Add first product",
    "What is in my cart?",
    "Budget 1000 rupees",
    "Checkout"
  ];

  return (
    <aside 
      id="voice-assistant-section"
      aria-label="Interactive Voice Assistant Controls"
      className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border-2 border-green-500/40 pointer-events-auto overflow-hidden transition-all">
        
        {/* Assistant Header Status Bar */}
        <div className="bg-slate-950/80 px-4 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Visual State Indicator */}
            <div className="relative flex items-center justify-center">
              {assistantState === 'listening' ? (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              ) : assistantState === 'speaking' ? (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              ) : (
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              )}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
              {assistantState === 'listening' 
                ? 'Listening to your voice...' 
                : assistantState === 'speaking' 
                ? 'VoiceCart is speaking...' 
                : assistantState === 'processing' 
                ? 'Processing command...' 
                : 'Voice Assistant Ready'}
            </span>

            <span className="hidden sm:inline text-[11px] text-slate-400">
              (Press Alt+V to speak)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={onRepeatSpeech}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 focus:ring-2 focus:ring-green-400"
              aria-label="Repeat last message spoken by the assistant"
              title="Repeat last speech"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Repeat</span>
            </button>

            {assistantState === 'speaking' && (
              <button
                onClick={onStopSpeaking}
                className="px-2 py-1 rounded bg-red-950 border border-red-700 hover:bg-red-900 text-red-200 flex items-center gap-1 focus:ring-2 focus:ring-red-400"
                aria-label="Stop VoiceCart from speaking"
                title="Stop speaking"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}

            <button
              onClick={openHelpModal}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 focus:ring-2 focus:ring-green-400"
              aria-label="Open voice command help dialog"
              title="Voice help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 focus:ring-2 focus:ring-green-400"
              aria-label={isExpanded ? 'Collapse voice assistant bar' : 'Expand voice assistant bar'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Assistant Main Body */}
        {isExpanded && (
          <div className="p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Big Microphone Push-to-Talk Button */}
              <button
                onClick={onToggleListening}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform focus:outline-none focus:ring-4 ${
                  assistantState === 'listening'
                    ? 'bg-red-600 hover:bg-red-700 text-white scale-105 ring-4 ring-red-400/50'
                    : assistantState === 'speaking'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white ring-4 ring-amber-400/50'
                    : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 ring-2 ring-green-400/40'
                }`}
                aria-label={
                  assistantState === 'listening' 
                    ? 'Assistant is currently listening. Press to stop.' 
                    : 'Press to speak your voice command'
                }
              >
                <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${assistantState === 'listening' ? 'animate-bounce' : ''}`} />
              </button>

              {/* Center Readout & Waveform */}
              <div className="flex-1 w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>
                    {assistantState === 'listening' 
                      ? 'Live Speech Transcript:' 
                      : assistantState === 'speaking'
                      ? 'Assistant Response:'
                      : 'VoiceCart Assistant Status:'}
                  </span>

                  {/* Audio Waveform Animation during listening/speaking */}
                  {(assistantState === 'listening' || assistantState === 'speaking') && (
                    <div className="flex items-center gap-1 h-5" aria-hidden="true">
                      <span className={`w-1 bg-green-400 rounded-full animate-wave-1`} />
                      <span className={`w-1 bg-green-400 rounded-full animate-wave-2`} />
                      <span className={`w-1 bg-green-400 rounded-full animate-wave-3`} />
                      <span className={`w-1 bg-green-400 rounded-full animate-wave-4`} />
                      <span className={`w-1 bg-green-400 rounded-full animate-wave-5`} />
                    </div>
                  )}
                </div>

                {/* Display Transcript or Response Text */}
                <p 
                  className="text-sm sm:text-base font-medium text-slate-100 min-h-[24px] select-text"
                  aria-live="polite"
                >
                  {transcript ? (
                    <span className="text-amber-300 font-semibold italic">"{transcript}"</span>
                  ) : lastSpeech ? (
                    lastSpeech
                  ) : (
                    <span className="text-slate-400">
                      Say "Hello VoiceCart" or tap the mic to speak. Example: "Search for basmati rice" or "Show vegetables"
                    </span>
                  )}
                </p>
              </div>

            </div>

            {/* Manual Command Input & Quick Suggested Commands */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              
              {/* Type Voice Command form (for users without working mic or silent environments) */}
              <form onSubmit={handleSubmit} className="w-full sm:w-80 flex items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type a voice command..."
                    className="w-full bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-green-400"
                    aria-label="Type a voice command to execute without microphone"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-green-400 hover:text-green-300 focus:outline-none"
                    aria-label="Send typed voice command"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Quick Command Pills */}
              <div 
                className="w-full flex-1 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none"
                role="region"
                aria-label="Quick voice command shortcuts"
              >
                {quickCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePillClick(cmd)}
                    className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-green-500/50 transition-colors focus:ring-2 focus:ring-green-400"
                  >
                    "{cmd}"
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
