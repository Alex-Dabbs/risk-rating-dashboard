import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { statusOptions } from '../data/findings'

export default function StatusMenu({ value, onChange, label, theme }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(0, statusOptions.indexOf(value)))
  const [position, setPosition] = useState(null)
  const menuId = useId()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const popupRef = useRef(null)
  const listboxRef = useRef(null)
  const selectedIndex = Math.max(0, statusOptions.indexOf(value))

  function updatePosition() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const width = Math.min(Math.max(rect.width, 150), window.innerWidth - 16)
    const below = window.innerHeight - rect.bottom - 8
    const above = rect.top - 8
    const placeAbove = below < 160 && above > below
    const maxHeight = Math.max(96, Math.min(240, placeAbove ? above : below))
    setPosition({ left: Math.min(Math.max(8, rect.left), window.innerWidth - width - 8), top: placeAbove ? Math.max(8, rect.top - Math.min(240, above) - 4) : rect.bottom + 4, width, maxHeight })
  }

  function openMenu(index = selectedIndex) {
    setActiveIndex(index)
    updatePosition()
    setOpen(true)
  }
  function closeMenu(returnFocus = false) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }
  function chooseStatus(status) {
    onChange(status)
    closeMenu(true)
  }

  useEffect(() => {
    if (!open) return undefined
    listboxRef.current?.focus()
    const reposition = () => updatePosition()
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target) && !popupRef.current?.contains(event.target)) closeMenu()
    }
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  function handleTriggerKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      openMenu(open ? (activeIndex + direction + statusOptions.length) % statusOptions.length : selectedIndex)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) chooseStatus(statusOptions[activeIndex])
      else openMenu()
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeMenu()
    }
  }
  function handleListboxKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + direction + statusOptions.length) % statusOptions.length)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : statusOptions.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      chooseStatus(statusOptions[activeIndex])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
    } else if (event.key === 'Tab') closeMenu(true)
  }

  const popup = open && position ? createPortal(
    <div ref={popupRef} className="status-menu-popup" data-theme={theme} style={position}>
      <div id={`${menuId}-listbox`} ref={listboxRef} className="status-menu-listbox" role="listbox" aria-label={`${label} options`} tabIndex={0} aria-activedescendant={`${menuId}-option-${activeIndex}`} onKeyDown={handleListboxKeyDown}>
        {statusOptions.map((status, index) => <div id={`${menuId}-option-${index}`} className={`status-menu-option${index === activeIndex ? ' active' : ''}${status === value ? ' selected' : ''}`} key={status} role="option" aria-selected={status === value} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseStatus(status)}>{status}</div>)}
      </div>
    </div>, document.body,
  ) : null

  return <>
    <div className="status-menu-root" ref={rootRef}>
      <button ref={triggerRef} type="button" className={`status-select ${value.toLowerCase().replaceAll(' ', '-')}`} aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${menuId}-listbox`} onClick={() => open ? closeMenu() : openMenu()} onKeyDown={handleTriggerKeyDown}>{value}<ChevronDown className="status-menu-chevron" aria-hidden="true" /></button>
    </div>
    {popup}
  </>
}
