'use client'

import { useEffect, useRef } from 'react'

interface ParticlesProps {
  particleCount?: number
  particleColor?: string
  lineColor?: string
  speed?: number
  interactive?: boolean
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  baseAlpha: number
}

export default function ParticlesBackground({
  particleCount = 45,
  particleColor = '99, 102, 241', // Indigo
  lineColor = '56, 189, 248',    // Sky blue
  speed = 0.6,
  interactive = true,
  className = '',
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight)

    const particles: Particle[] = []
    const mouse = { x: -1000, y: -1000, radius: 150 }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2 + 1
      const alpha = Math.random() * 0.6 + 0.2
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius,
        alpha,
        baseAlpha: alpha,
      })
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', handleResize)
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse distance check for glow
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (interactive && dist < mouse.radius) {
          p.alpha = Math.min(1, p.baseAlpha + (1 - dist / mouse.radius) * 0.6)
        } else {
          p.alpha = p.baseAlpha
        }

        // Draw glowing particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${particleColor}, 0.8)`
        ctx.fill()

        // Connect nearby particles with lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const ldx = p.x - p2.x
          const ldy = p.y - p2.y
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy)

          if (ldist < 120) {
            const lineAlpha = (1 - ldist / 120) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [particleCount, particleColor, lineColor, speed, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60 ${className}`.trim()}
    />
  )
}
