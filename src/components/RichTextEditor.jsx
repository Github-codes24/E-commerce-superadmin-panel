import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Minus,
  Undo2,
  Redo2,
  Type,
  Palette,
  Highlighter,
  RemoveFormatting,
  Eye,
  Code2,
  Maximize2,
  Minimize2,
  Indent,
  Outdent,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Check,
  Sparkles
} from 'lucide-react'
import './RichTextEditor.css'

// Color swatches presets
const TEXT_COLORS = [
  { name: 'Default Dark', value: '#1e293b' },
  { name: 'Muted Slate', value: '#64748b' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Deep Indigo', value: '#4338ca' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#16a34a' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Coral Red', value: '#dc2626' },
  { name: 'Rose Pink', value: '#db2777' },
  { name: 'Sky Blue', value: '#0284c7' },
]

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Lime Green', value: '#bbf7d0' },
  { name: 'Sky Blue', value: '#bfdbfe' },
  { name: 'Soft Purple', value: '#e9d5ff' },
  { name: 'Soft Pink', value: '#fbcfe8' },
  { name: 'Peach', value: '#fed7aa' },
  { name: 'Light Gray', value: '#f1f5f9' },
  { name: 'Warm Amber', value: '#fef3c7' },
]

const FONT_FAMILIES = [
  { label: 'Default Font (Modern Sans)', value: 'inherit' },
  { label: 'Poppins (Shopnow Modern)', value: "'Poppins', sans-serif" },
  { label: 'Inter (Clean Tech)', value: "'Inter', system-ui, sans-serif" },
  { label: 'Georgia (Editorial Serif)', value: "Georgia, Cambria, 'Times New Roman', serif" },
  { label: 'Merriweather (Classic Book)', value: "'Merriweather', Georgia, serif" },
  { label: 'Monospace (Code Style)', value: "'Courier New', Courier, monospace" },
]

const FONT_SIZES = [
  { label: '12px (Smallest)', value: '12px' },
  { label: '14px (Small)', value: '14px' },
  { label: '16px (Normal / Body)', value: '16px' },
  { label: '18px (Medium / Lead)', value: '18px' },
  { label: '20px (Large)', value: '20px' },
  { label: '24px (X-Large / Subhead)', value: '24px' },
  { label: '28px (2X-Large / Heading)', value: '28px' },
  { label: '32px (Huge / Title)', value: '32px' },
]

/**
 * RichTextEditor Component
 *
 * Full-featured WYSIWYG editor that generates clean, styled HTML
 * while strictly preserving spaces, font styles, colors, and layouts.
 */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write your shopping advice, tips, recommendations, and reviews here...',
  minHeight = '300px'
}) {
  const editorRef = useRef(null)
  const [activeTab, setActiveTab] = useState('visual') // 'visual' | 'preview' | 'html'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [htmlCode, setHtmlCode] = useState(value || '')

  // Color picker popover states
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [customTextColor, setCustomTextColor] = useState('#7c3aed')
  const [customHighlightColor, setCustomHighlightColor] = useState('#fef08a')

  // Link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const savedSelectionRange = useRef(null)

  // Image dialog state
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  // Word & character counts
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  // Sync internal HTML with incoming value prop if not currently focused
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || ''
      }
    }
    setHtmlCode(value || '')
    updateStats(value || '')
  }, [value])

  const updateStats = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html || ''
    const text = tmp.textContent || tmp.innerText || ''
    setCharCount(text.length)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    setWordCount(words)
  }

  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return
    const newHtml = editorRef.current.innerHTML
    setHtmlCode(newHtml)
    updateStats(newHtml)
    if (onChange) {
      onChange(newHtml)
    }
  }, [onChange])

  // Save selection before opening modal dialogs
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange()
    }
  }

  // Restore selection
  const restoreSelection = () => {
    if (savedSelectionRange.current) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(savedSelectionRange.current)
    }
  }

  // Generic document command executor
  const executeCmd = (command, val = null) => {
    document.execCommand('styleWithCSS', false, true)
    document.execCommand(command, false, val)
    handleContentChange()
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Custom Inline Style Applier (for exact font size, font family, etc.)
  const applyInlineStyle = (property, val) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const range = sel.getRangeAt(0)
    if (range.collapsed) {
      // Nothing selected: insert an empty span with that style or set caret
      const span = document.createElement('span')
      span.style[property] = val
      span.innerHTML = '&#8203;' // zero-width space
      range.insertNode(span)
      range.selectNodeContents(span)
      sel.removeAllRanges()
      sel.addRange(range)
      handleContentChange()
      return
    }

    try {
      const span = document.createElement('span')
      span.style[property] = val
      span.appendChild(range.extractContents())
      range.insertNode(span)

      sel.removeAllRanges()
      const newRange = document.createRange()
      newRange.selectNodeContents(span)
      sel.addRange(newRange)
      handleContentChange()
    } catch (err) {
      console.warn('Could not apply inline style:', err)
    }
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Block format applier (H1, H2, H3, P, Blockquote)
  const handleBlockFormatChange = (e) => {
    const tag = e.target.value
    if (!tag) return
    if (tag === 'p') {
      document.execCommand('formatBlock', false, '<p>')
    } else if (tag === 'blockquote') {
      document.execCommand('formatBlock', false, '<blockquote>')
    } else if (tag === 'pre') {
      document.execCommand('formatBlock', false, '<pre>')
    } else {
      document.execCommand('formatBlock', false, `<${tag}>`)
    }
    handleContentChange()
    e.target.value = ''
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Font family selector
  const handleFontFamilyChange = (e) => {
    const font = e.target.value
    if (!font) return
    applyInlineStyle('fontFamily', font)
    e.target.value = ''
  }

  // Font size selector
  const handleFontSizeChange = (e) => {
    const size = e.target.value
    if (!size) return
    applyInlineStyle('fontSize', size)
    e.target.value = ''
  }

  // Text color applier
  const applyTextColor = (color) => {
    executeCmd('foreColor', color)
    setShowTextColorPicker(false)
  }

  // Highlight color applier
  const applyHighlightColor = (color) => {
    document.execCommand('styleWithCSS', false, true)
    document.execCommand('hiliteColor', false, color)
    handleContentChange()
    setShowHighlightPicker(false)
  }

  // Tab key handler: preserves consecutive spacing by inserting non-breaking spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      // Insert 4 non-breaking spaces
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
      handleContentChange()
    }
  }

  // Link Dialog submit
  const handleApplyLink = () => {
    restoreSelection()
    if (!linkUrl) {
      setShowLinkDialog(false)
      return
    }

    let validUrl = linkUrl.trim()
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://') && !validUrl.startsWith('mailto:')) {
      validUrl = 'https://' + validUrl
    }

    const sel = window.getSelection()
    if (sel && !sel.isCollapsed && sel.toString().trim()) {
      // Wrap existing selection in link
      document.execCommand('createLink', false, validUrl)
      // Make link open in new tab
      if (editorRef.current) {
        const links = editorRef.current.querySelectorAll(`a[href="${validUrl}"]`)
        links.forEach(a => {
          a.setAttribute('target', '_blank')
          a.setAttribute('rel', 'noopener noreferrer')
        })
      }
    } else {
      // Insert link with custom text
      const displayText = linkText.trim() || validUrl
      const linkHtml = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer">${displayText}</a>`
      document.execCommand('insertHTML', false, linkHtml)
    }

    handleContentChange()
    setShowLinkDialog(false)
    setLinkUrl('')
    setLinkText('')
  }

  // Image Dialog submit
  const handleApplyImage = () => {
    restoreSelection()
    if (!imageUrl.trim()) {
      setShowImageDialog(false)
      return
    }

    const alt = imageAlt.trim() || 'Blog illustration'
    const imgHtml = `<figure style="margin: 1.5em 0;"><img src="${imageUrl.trim()}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px;" />${imageAlt.trim() ? `<figcaption style="text-align: center; font-size: 13px; color: #64748b; margin-top: 6px;">${alt}</figcaption>` : ''}</figure><p><br></p>`
    document.execCommand('insertHTML', false, imgHtml)

    handleContentChange()
    setShowImageDialog(false)
    setImageUrl('')
    setImageAlt('')
  }

  // Switch to HTML mode handler
  const handleRawHtmlChange = (e) => {
    const val = e.target.value
    setHtmlCode(val)
    updateStats(val)
    if (onChange) {
      onChange(val)
    }
  }

  // Estimated read time
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className={`rte-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* ── Top Bar: Mode Switcher & Fullscreen ── */}
      <div className="rte-top-bar">
        <div className="rte-modes-tabs">
          <button
            type="button"
            className={`rte-mode-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => setActiveTab('visual')}
            title="Visual Rich Text Editor"
          >
            <Type size={14} />
            Visual Editor
          </button>
          <button
            type="button"
            className={`rte-mode-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            title="Preview how blog appears on Customer Page"
          >
            <Eye size={14} />
            Customer View Preview
          </button>
          <button
            type="button"
            className={`rte-mode-btn ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
            title="Edit Raw HTML Code"
          >
            <Code2 size={14} />
            HTML Code
          </button>
        </div>

        <div className="rte-top-actions">
          <button
            type="button"
            className="rte-top-action-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ── Main Formatting Toolbar (Only in Visual Mode) ── */}
      {activeTab === 'visual' && (
        <div className="rte-toolbar">
          {/* Group 1: Undo / Redo */}
          <div className="rte-toolbar-group">
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('undo'); }}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('redo'); }}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={15} />
            </button>
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 2: Headings / Block Types */}
          <div className="rte-toolbar-group">
            <select
              className="rte-select"
              onChange={handleBlockFormatChange}
              defaultValue=""
              title="Text Block Style"
            >
              <option value="" disabled>Heading Style...</option>
              <option value="p">Paragraph (Normal)</option>
              <option value="h1">Heading 1 (28px Bold)</option>
              <option value="h2">Heading 2 (22px Bold)</option>
              <option value="h3">Heading 3 (18px Semi-bold)</option>
              <option value="h4">Heading 4 (16px Semi-bold)</option>
              <option value="blockquote">Quote Block</option>
              <option value="pre">Code Block</option>
            </select>
          </div>

          {/* Group 3: Font Family */}
          <div className="rte-toolbar-group">
            <select
              className="rte-select"
              onChange={handleFontFamilyChange}
              defaultValue=""
              title="Font Family"
              style={{ maxWidth: '140px' }}
            >
              <option value="" disabled>Font Family...</option>
              {FONT_FAMILIES.map(f => (
                <option key={f.label} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Group 4: Font Size */}
          <div className="rte-toolbar-group">
            <select
              className="rte-select"
              onChange={handleFontSizeChange}
              defaultValue=""
              title="Font Size"
            >
              <option value="" disabled>Font Size...</option>
              {FONT_SIZES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 5: Text Styling (B, I, U, S) */}
          <div className="rte-toolbar-group">
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('bold'); }}
              title="Bold (Ctrl+B)"
            >
              <Bold size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('italic'); }}
              title="Italic (Ctrl+I)"
            >
              <Italic size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('underline'); }}
              title="Underline (Ctrl+U)"
            >
              <Underline size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('strikeThrough'); }}
              title="Strikethrough"
            >
              <Strikethrough size={15} />
            </button>
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 6: Color & Highlight */}
          <div className="rte-toolbar-group" style={{ position: 'relative' }}>
            {/* Text Color Picker */}
            <button
              type="button"
              className={`rte-btn ${showTextColorPicker ? 'active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault()
                saveSelection()
                setShowTextColorPicker(!showTextColorPicker)
                setShowHighlightPicker(false)
              }}
              title="Text Color"
            >
              <Palette size={15} />
            </button>

            {showTextColorPicker && (
              <div className="rte-color-picker-popover">
                <div className="rte-color-popover-title">Text Color</div>
                <div className="rte-color-swatches-grid">
                  {TEXT_COLORS.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      className="rte-color-swatch-btn"
                      style={{ backgroundColor: c.value }}
                      onClick={() => applyTextColor(c.value)}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="rte-color-custom-row">
                  <input
                    type="color"
                    className="rte-color-custom-input"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                  />
                  <button
                    type="button"
                    className="rte-dialog-btn primary"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                    onClick={() => applyTextColor(customTextColor)}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="rte-color-reset-btn"
                    onClick={() => applyTextColor('#1e293b')}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Highlight Color Picker */}
            <button
              type="button"
              className={`rte-btn ${showHighlightPicker ? 'active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault()
                saveSelection()
                setShowHighlightPicker(!showHighlightPicker)
                setShowTextColorPicker(false)
              }}
              title="Highlight Background"
            >
              <Highlighter size={15} />
            </button>

            {showHighlightPicker && (
              <div className="rte-color-picker-popover">
                <div className="rte-color-popover-title">Highlight Color</div>
                <div className="rte-color-swatches-grid">
                  {HIGHLIGHT_COLORS.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      className="rte-color-swatch-btn"
                      style={{ backgroundColor: c.value }}
                      onClick={() => applyHighlightColor(c.value)}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="rte-color-custom-row">
                  <input
                    type="color"
                    className="rte-color-custom-input"
                    value={customHighlightColor}
                    onChange={(e) => setCustomHighlightColor(e.target.value)}
                  />
                  <button
                    type="button"
                    className="rte-dialog-btn primary"
                    style={{ padding: '3px 8px', fontSize: '11px' }}
                    onClick={() => applyHighlightColor(customHighlightColor)}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="rte-color-reset-btn"
                    onClick={() => applyHighlightColor('transparent')}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 7: Alignment */}
          <div className="rte-toolbar-group">
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('justifyLeft'); }}
              title="Align Left"
            >
              <AlignLeft size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('justifyCenter'); }}
              title="Align Center"
            >
              <AlignCenter size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('justifyRight'); }}
              title="Align Right"
            >
              <AlignRight size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('justifyFull'); }}
              title="Justify Full"
            >
              <AlignJustify size={15} />
            </button>
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 8: Lists & Indentation */}
          <div className="rte-toolbar-group">
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('insertUnorderedList'); }}
              title="Bulleted List"
            >
              <List size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('insertOrderedList'); }}
              title="Numbered List"
            >
              <ListOrdered size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('outdent'); }}
              title="Decrease Indent"
            >
              <Outdent size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('indent'); }}
              title="Increase Indent"
            >
              <Indent size={15} />
            </button>
          </div>

          <div className="rte-toolbar-divider" />

          {/* Group 9: Insert Links, Images, Dividers */}
          <div className="rte-toolbar-group">
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                saveSelection()
                const sel = window.getSelection()
                setLinkText(sel ? sel.toString() : '')
                setShowLinkDialog(true)
              }}
              title="Insert / Edit Link"
            >
              <LinkIcon size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('unlink'); }}
              title="Remove Link"
            >
              <Unlink size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => {
                e.preventDefault()
                saveSelection()
                setShowImageDialog(true)
              }}
              title="Insert Inline Image"
            >
              <ImageIcon size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('insertHorizontalRule'); }}
              title="Horizontal Divider Line"
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              className="rte-btn"
              onMouseDown={(e) => { e.preventDefault(); executeCmd('removeFormat'); }}
              title="Clear Formatting"
            >
              <RemoveFormatting size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Visual ContentEditable Editor ── */}
      {activeTab === 'visual' && (
        <div
          ref={editorRef}
          className="rte-editor-container"
          contentEditable
          data-placeholder={placeholder}
          onInput={handleContentChange}
          onBlur={handleContentChange}
          onKeyDown={handleKeyDown}
          style={{ minHeight }}
          spellCheck
        />
      )}

      {/* ── Customer View Preview Mode (Simulates Customer Blog Page) ── */}
      {activeTab === 'preview' && (
        <div className="rte-preview-box" style={{ minHeight }}>
          <div className="rte-preview-notice-badge">
            <Sparkles size={13} />
            Live Customer Page Typography Simulation
          </div>
          <div
            className="customer-blog-render"
            dangerouslySetInnerHTML={{ __html: htmlCode || `<p style="color: #94a3b8; font-style: italic;">No content yet. Type in the Visual Editor tab to see the live customer preview.</p>` }}
          />
        </div>
      )}

      {/* ── Raw HTML Source Code Mode ── */}
      {activeTab === 'html' && (
        <textarea
          className="rte-html-textarea"
          value={htmlCode}
          onChange={handleRawHtmlChange}
          placeholder="<p>Write or paste standard HTML blog content here...</p>"
          style={{ minHeight }}
        />
      )}

      {/* ── Bottom Status Bar ── */}
      <div className="rte-status-bar">
        <div className="rte-status-stats">
          <span className="rte-status-item">
            Words: <strong>{wordCount}</strong>
          </span>
          <span className="rte-status-item">
            Characters: <strong>{charCount}</strong>
          </span>
          <span className="rte-status-item">
            Reading Time: <strong>{estimatedReadTime} min read</strong>
          </span>
        </div>
        <div className="rte-status-hint">
          <Check size={13} />
          Exact spaces, fonts, colors, and line-breaks are preserved
        </div>
      </div>

      {/* ── Insert Link Modal Dialog ── */}
      {showLinkDialog && (
        <div className="rte-dialog-overlay" onClick={() => setShowLinkDialog(false)}>
          <div className="rte-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="rte-dialog-title">Insert Link</h4>
            <div className="rte-dialog-field">
              <label>Web Link / URL *</label>
              <input
                type="url"
                placeholder="https://shopnow4u.com/product/..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div className="rte-dialog-field">
              <label>Display Text (Optional)</label>
              <input
                type="text"
                placeholder="Click here to view"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div className="rte-dialog-actions">
              <button
                type="button"
                className="rte-dialog-btn cancel"
                onClick={() => setShowLinkDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rte-dialog-btn primary"
                onClick={handleApplyLink}
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Insert Image Modal Dialog ── */}
      {showImageDialog && (
        <div className="rte-dialog-overlay" onClick={() => setShowImageDialog(false)}>
          <div className="rte-dialog-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="rte-dialog-title">Insert Inline Image</h4>
            <div className="rte-dialog-field">
              <label>Image URL *</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or S3 image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div className="rte-dialog-field">
              <label>Caption / Alt Text (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Modern living room sofa"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
            <div className="rte-dialog-actions">
              <button
                type="button"
                className="rte-dialog-btn cancel"
                onClick={() => setShowImageDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rte-dialog-btn primary"
                onClick={handleApplyImage}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
