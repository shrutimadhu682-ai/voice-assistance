import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // Settings with localStorage persistence
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    const saved = localStorage.getItem('vc_voice_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [speechSpeed, setSpeechSpeed] = useState(() => {
    return parseFloat(localStorage.getItem('vc_speech_speed')) || 1.0;
  });

  const [voiceVolume, setVoiceVolume] = useState(() => {
    return parseFloat(localStorage.getItem('vc_voice_volume')) || 1.0;
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('vc_font_size') || 'normal'; // 'normal', 'large', 'xlarge'
  });

  const [contrastMode, setContrastMode] = useState(() => {
    return localStorage.getItem('vc_contrast_mode') || 'default'; // 'default', 'high-contrast-dark', 'yellow-black'
  });

  const [simplifiedMode, setSimplifiedMode] = useState(() => {
    const saved = localStorage.getItem('vc_simplified_mode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [autoPageRead, setAutoPageRead] = useState(() => {
    const saved = localStorage.getItem('vc_auto_page_read');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('vc_sound_effects');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Screen reader announcements for aria-live
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState('');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('vc_voice_enabled', JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem('vc_speech_speed', speechSpeed.toString());
  }, [speechSpeed]);

  useEffect(() => {
    localStorage.setItem('vc_voice_volume', voiceVolume.toString());
  }, [voiceVolume]);

  useEffect(() => {
    localStorage.setItem('vc_font_size', fontSize);
    const root = document.documentElement;
    if (fontSize === 'xlarge') {
      root.style.setProperty('--font-scale', '1.25');
    } else if (fontSize === 'large') {
      root.style.setProperty('--font-scale', '1.12');
    } else {
      root.style.setProperty('--font-scale', '1.0');
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('vc_contrast_mode', contrastMode);
    document.body.classList.remove('theme-high-contrast-dark', 'theme-yellow-black');
    if (contrastMode === 'high-contrast-dark') {
      document.body.classList.add('theme-high-contrast-dark');
    } else if (contrastMode === 'yellow-black') {
      document.body.classList.add('theme-yellow-black');
    }
  }, [contrastMode]);

  useEffect(() => {
    localStorage.setItem('vc_simplified_mode', JSON.stringify(simplifiedMode));
  }, [simplifiedMode]);

  useEffect(() => {
    localStorage.setItem('vc_auto_page_read', JSON.stringify(autoPageRead));
  }, [autoPageRead]);

  useEffect(() => {
    localStorage.setItem('vc_sound_effects', JSON.stringify(soundEffectsEnabled));
  }, [soundEffectsEnabled]);

  const announce = (message, priority = 'polite') => {
    if (!message) return;
    if (priority === 'assertive') {
      setAssertiveAnnouncement('');
      setTimeout(() => setAssertiveAnnouncement(message), 50);
    } else {
      setLiveAnnouncement('');
      setTimeout(() => setLiveAnnouncement(message), 50);
    }
  };

  const playCue = (type) => {
    if (soundEffectsEnabled) {
      soundManager.play(type);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
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
        announce,
        playCue,
      }}
    >
      {children}
      {/* Off-screen screen-reader live regions */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-polite"
      >
        {liveAnnouncement}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-assertive"
      >
        {assertiveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
