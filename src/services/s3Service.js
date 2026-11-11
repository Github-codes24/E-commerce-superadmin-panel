/**
 * S3-Compatible Object Storage Service (ACES3 / AWS S3)
 * Provides direct, high-speed, secure image and file uploads
 * using native Web Crypto AWS SigV4 signing.
 */

// S3 Configuration (supports Vite client env and defaults)
export const S3_CONFIG = {
  region: import.meta.env?.VITE_S3_REGION || 'ap-south-noi-1',
  endpoint: import.meta.env?.VITE_S3_ENDPOINT || 'https://s3-noi.aces3.ai',
  accessKey: import.meta.env?.VITE_S3_ACCESS_KEY || 'AKIAS12GDHZY0RV877142',
  secretKey: import.meta.env?.VITE_S3_SECRET_KEY || 'V4yOogh62My0b9Fn7wU3ULdcoc7lJ+6WDzqsgcl3',
  bucket: import.meta.env?.VITE_S3_BUCKET || 'ecommerce',
  publicUrl: import.meta.env?.VITE_S3_PUBLIC_URL || 'https://s3-noi.aces3.ai/ecommerce'
}

const textEncoder = new TextEncoder()

/**
 * Get the Web Crypto subtle instance
 */
function getSubtleCrypto() {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle
  }
  throw new Error('Web Crypto API (crypto.subtle) is not supported in this environment.')
}

/**
 * SHA-256 Hex Hash
 */
async function sha256Hex(bufferOrStr) {
  const subtle = getSubtleCrypto()
  const data = typeof bufferOrStr === 'string' ? textEncoder.encode(bufferOrStr) : bufferOrStr
  const hashBuffer = await subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * HMAC-SHA256
 */
async function hmacSha256(keyData, msgData) {
  const subtle = getSubtleCrypto()
  const key = await subtle.importKey(
    'raw',
    typeof keyData === 'string' ? textEncoder.encode(keyData) : keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await subtle.sign(
    'HMAC',
    key,
    typeof msgData === 'string' ? textEncoder.encode(msgData) : msgData
  )
  return new Uint8Array(signature)
}

/**
 * Convert base64 Data URL to Blob
 */
export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * Sanitize file extension
 */
function getExtension(filename, mimeType) {
  if (filename && filename.includes('.')) {
    const ext = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf'].includes(ext)) {
      return ext
    }
  }
  if (mimeType) {
    if (mimeType.includes('png')) return 'png'
    if (mimeType.includes('webp')) return 'webp'
    if (mimeType.includes('gif')) return 'gif'
    if (mimeType.includes('svg')) return 'svg'
    if (mimeType.includes('pdf')) return 'pdf'
  }
  return 'jpg'
}

/**
 * Upload single File, Blob, or base64 image directly to S3
 * @param {File|Blob|string} fileInput - The File, Blob, or base64 data URL
 * @param {string} folder - Destination folder (e.g., 'categories', 'products', 'admins', 'vendors', 'profiles', 'banners')
 * @param {string} [customFileName] - Optional custom name
 * @returns {Promise<{ success: boolean, url: string, key: string, bucket: string, size: number }>}
 */
export async function uploadFileToS3(fileInput, folder = 'uploads', customFileName = null) {
  if (!fileInput) {
    throw new Error('No file provided for upload')
  }

  let blob
  let originalName = ''
  let contentType = 'image/jpeg'

  if (typeof fileInput === 'string' && fileInput.startsWith('data:')) {
    blob = dataURLtoBlob(fileInput)
    contentType = blob.type || 'image/jpeg'
  } else if (fileInput instanceof Blob || (typeof File !== 'undefined' && fileInput instanceof File)) {
    blob = fileInput
    originalName = fileInput.name || ''
    contentType = fileInput.type || 'image/jpeg'
  } else {
    throw new Error('Unsupported file input type. Must be File, Blob, or base64 data URL.')
  }

  const arrayBuffer = await blob.arrayBuffer()
  const fileBytes = new Uint8Array(arrayBuffer)
  const ext = getExtension(originalName, contentType)

  const cleanFolder = folder.replace(/^\/+|\/+$/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 9)
  const fileName = customFileName
    ? `${customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`
    : `${cleanFolder}_${Date.now()}_${randomSuffix}.${ext}`

  const objectKey = cleanFolder ? `${cleanFolder}/${fileName}` : fileName

  const bodyHash = await sha256Hex(fileBytes)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.substring(0, 8)

  const endpointUrl = new URL(S3_CONFIG.endpoint)
  const host = endpointUrl.host

  // Path-style S3 URI: /{bucket}/{key}
  const canonicalUri = `/${S3_CONFIG.bucket}/${objectKey}`
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${bodyHash}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'

  const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${bodyHash}`
  const algorithm = 'AWS4-HMAC-SHA256'
  const credentialScope = `${dateStamp}/${S3_CONFIG.region}/s3/aws4_request`
  const canonicalRequestHash = await sha256Hex(canonicalRequest)
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`

  // Key derivation
  const kDate = await hmacSha256('AWS4' + S3_CONFIG.secretKey, dateStamp)
  const kRegion = await hmacSha256(kDate, S3_CONFIG.region)
  const kService = await hmacSha256(kRegion, 's3')
  const kSigning = await hmacSha256(kService, 'aws4_request')
  const signatureBytes = await hmacSha256(kSigning, stringToSign)
  const signature = Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('')

  const authorizationHeader = `${algorithm} Credential=${S3_CONFIG.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const targetUrl = `${S3_CONFIG.endpoint}/${S3_CONFIG.bucket}/${objectKey}`

  const response = await fetch(targetUrl, {
    method: 'PUT',
    headers: {
      'Host': host,
      'Content-Type': contentType,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': bodyHash,
      'Authorization': authorizationHeader
    },
    body: fileBytes
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`S3 upload failed with status ${response.status}: ${errText || response.statusText}`)
  }

  // Publicly accessible URL for the uploaded asset
  const publicAssetUrl = `${S3_CONFIG.publicUrl.replace(/\/+$/, '')}/${objectKey}`

  return {
    success: true,
    url: publicAssetUrl,
    key: objectKey,
    bucket: S3_CONFIG.bucket,
    size: fileBytes.byteLength,
    contentType
  }
}

/**
 * Upload multiple files in parallel
 * @param {Array<File|Blob|string>} files
 * @param {string} folder
 * @returns {Promise<Array<string>>} List of public URLs
 */
export async function uploadMultipleFilesToS3(files, folder = 'uploads') {
  if (!Array.isArray(files) || files.length === 0) return []
  const uploadPromises = files.map(file => uploadFileToS3(file, folder))
  const results = await Promise.all(uploadPromises)
  return results.map(r => r.url)
}

/**
 * Check if a URL is an S3 URL or already hosted remotely
 */
export function isRemoteOrS3Url(url) {
  if (!url || typeof url !== 'string') return false
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.includes('s3-noi.aces3.ai') ||
    url.includes('amazonaws.com')
  )
}

/**
 * Test connectivity to S3 storage
 */
export async function testS3Connection() {
  try {
    const testBlob = new Blob(['S3 Connection Healthy'], { type: 'text/plain' })
    const result = await uploadFileToS3(testBlob, 'system-health-check', `ping_${Date.now()}`)
    return { ok: true, url: result.url }
  } catch (error) {
    console.error('S3 Connection Test Failed:', error)
    return { ok: false, error: error.message }
  }
}

export default {
  S3_CONFIG,
  uploadFileToS3,
  uploadMultipleFilesToS3,
  isRemoteOrS3Url,
  testS3Connection
}

