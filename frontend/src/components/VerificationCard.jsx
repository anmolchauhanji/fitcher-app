import React, { useState } from 'react'
import VERIFICATION_META from '../constants/verificationMeta'

export default function VerificationCard({
  status = 'pending',
  documentImage = null,
  onReload = () => {},
  onUpload = () => {},
  onEdit = () => {},
}) {
  const meta = VERIFICATION_META[status] || VERIFICATION_META.pending
  const [showModal, setShowModal] = useState(!!(status === 'pending' && meta.popupOnPending))

  return (
    <div style={{ background: '#0F1720', borderRadius: 12, padding: 18, color: '#E6EEF0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{meta.label}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 999,
              background: meta.color,
              color: '#041014',
              fontWeight: 600,
            }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ width: 140, height: 90, borderRadius: 8, background: '#0B1220', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {documentImage ? (
            <img src={documentImage} alt="document" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} />
          ) : (
            <div style={{ color: '#9CA3AF' }}>No document</div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 8px 0', color: '#B6C2C8' }}>{meta.description}</p>

          <div style={{ display: 'flex', gap: 8 }}>
            {meta.showReload && (
              <button onClick={onReload} style={{ padding: '8px 12px', background: '#111827', color: '#E6EEF0', borderRadius: 8, border: '1px solid #2D3748' }}>Reload</button>
            )}

            {meta.allowUploadEdit && (
              <>
                <button onClick={onUpload} style={{ padding: '8px 12px', background: '#06B6D4', color: '#041014', borderRadius: 8, border: 'none' }}>Upload</button>
                <button onClick={onEdit} style={{ padding: '8px 12px', background: '#111827', color: '#E6EEF0', borderRadius: 8, border: '1px solid #2D3748' }}>Edit</button>
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.6)' }} onClick={() => setShowModal(false)} />
          <div style={{ zIndex: 50, background: '#0B1220', padding: 20, width: 420, borderRadius: 12, boxShadow: '0 10px 30px rgba(2,6,23,0.6)' }}>
            <h4 style={{ marginTop: 0 }}>{meta.label}</h4>
            <p style={{ color: '#B6C2C8' }}>{meta.description}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {meta.showReload && <button onClick={() => { onReload(); setShowModal(false) }} style={{ padding: '8px 12px' }}>Reload</button>}
              {meta.allowUploadEdit && <button onClick={() => { onUpload(); setShowModal(false) }} style={{ padding: '8px 12px', background: '#06B6D4', color: '#041014', border: 'none', borderRadius: 6 }}>Upload</button>}
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 12px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
