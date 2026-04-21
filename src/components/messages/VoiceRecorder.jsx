import { useEffect, useRef, useState } from 'react'

const SUPPORTED =
  typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && !!window.MediaRecorder

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

/**
 * VoiceRecorder
 *
 * Props:
 *   onSend(blobUrl: string, durationSec: number) — called when the user confirms the recording
 */
export function VoiceRecorder({ onSend }) {
  const [phase, setPhase] = useState('idle') // idle | requesting | recording | preview
  const [elapsed, setElapsed] = useState(0)
  const [blobUrl, setBlobUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      stopStream()
      clearInterval(timerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  async function startRecording() {
    if (!SUPPORTED) return
    setPhase('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = ['audio/webm', 'audio/ogg', 'audio/mp4'].find((t) =>
        MediaRecorder.isTypeSupported(t),
      )
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
        setDuration(elapsed)
        setPhase('preview')
      }

      mediaRecorderRef.current = recorder
      recorder.start(100)

      setElapsed(0)
      setPhase('recording')
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true)
      }
      setPhase('idle')
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
    stopStream()
  }

  function cancelPreview() {
    if (blobUrl) URL.revokeObjectURL(blobUrl)
    setBlobUrl(null)
    setElapsed(0)
    setPhase('idle')
  }

  function confirmSend() {
    if (!blobUrl) return
    onSend(blobUrl, duration)
    setBlobUrl(null)
    setElapsed(0)
    setPhase('idle')
  }

  if (!SUPPORTED) return null

  // ── Preview phase ──────────────────────────────────────────────────────────
  if (phase === 'preview') {
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 1 }}>
        <audio src={blobUrl} controls style={{ height: 32, flex: 1, minWidth: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--ink-m)', whiteSpace: 'nowrap' }}>
          {formatTime(duration)}
        </span>
        <button
          type="button"
          title="Discard"
          onClick={cancelPreview}
          style={btnStyle('#fef2f2', '#ef4444')}
        >
          🗑
        </button>
        <button
          type="button"
          title="Send voice message"
          onClick={confirmSend}
          style={btnStyle('#f0f9f0', '#16a34a')}
        >
          ✓ Send
        </button>
      </div>
    )
  }

  // ── Recording phase ────────────────────────────────────────────────────────
  if (phase === 'recording') {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ef4444',
            animation: 'pulse 1s infinite',
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: 'var(--ink-s)',
            fontVariantNumeric: 'tabular-nums',
            minWidth: 36,
          }}
        >
          {formatTime(elapsed)}
        </span>
        <button type="button" onClick={stopRecording} style={btnStyle('#fef2f2', '#ef4444')}>
          ■ Stop
        </button>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    )
  }

  // ── Idle / requesting ──────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        title={permissionDenied ? 'Microphone access denied' : 'Record voice message'}
        disabled={phase === 'requesting' || permissionDenied}
        onClick={startRecording}
        style={{
          ...btnStyle(
            permissionDenied ? '#f3f4f6' : '#f7fbf5',
            permissionDenied ? '#9ca3af' : 'var(--sage)',
          ),
          opacity: phase === 'requesting' ? 0.6 : 1,
          cursor: permissionDenied ? 'not-allowed' : 'pointer',
        }}
      >
        🎙
      </button>
      {permissionDenied && (
        <span
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1f2937',
            color: '#fff',
            fontSize: 11,
            borderRadius: 6,
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Microphone access denied
        </span>
      )}
    </div>
  )
}

function btnStyle(bg, color) {
  return {
    background: bg,
    border: `1px solid ${color}`,
    borderRadius: 999,
    color,
    padding: '6px 10px',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: 600,
  }
}
