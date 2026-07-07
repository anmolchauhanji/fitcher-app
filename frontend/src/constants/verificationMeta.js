export const VERIFICATION_META = {
  pending: {
    color: '#F59E0B', // amber-500
    label: 'Pending Verification',
    description: 'Your document has been submitted and is under review.',
    showReload: true,
    allowUploadEdit: true,
    popupOnPending: true,
  },
  verified: {
    color: '#10B981', // emerald-500
    label: 'Verified',
    description: 'This document has been verified.',
    showReload: false,
    allowUploadEdit: false,
    popupOnPending: false,
  },
  rejected: {
    color: '#EF4444', // red-500
    label: 'Rejected',
    description: 'Verification failed — please re-upload the document or edit details.',
    showReload: true,
    allowUploadEdit: true,
    popupOnPending: false,
  },
  suspended: {
    color: '#6B7280', // gray-500
    label: 'Suspended',
    description: 'Verification suspended — contact support for help.',
    showReload: false,
    allowUploadEdit: false,
    popupOnPending: false,
  },
}

export default VERIFICATION_META
