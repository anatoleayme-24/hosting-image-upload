import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["canvas"]

  connect() {
    this.canvas = this.canvasTarget
    this.ctx = this.canvas.getContext("2d")
    this.stars = []
    this.animationId = null

    this.resize()
    this.animate()

    this.resizeHandler = () => this.resize()
    window.addEventListener("resize", this.resizeHandler)
  }

  disconnect() {
    cancelAnimationFrame(this.animationId)
    window.removeEventListener("resize", this.resizeHandler)
  }

  resize() {
    this.canvas.width = this.element.offsetWidth
    this.canvas.height = this.element.offsetHeight
    this.initStars()
  }

  initStars() {
    const count = Math.floor(this.canvas.width / 8)
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.4,
      opacity: Math.random() * 0.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2
    }))
  }

  animate() {
    this.update()
    this.draw()
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  update() {
    const w = this.canvas.width
    const h = this.canvas.height
    for (const s of this.stars) {
      s.x += s.vx
      s.y += s.vy
      s.twinkle += 0.02
      if (s.x < 0) s.x = w
      if (s.x > w) s.x = 0
      if (s.y < 0) s.y = h
      if (s.y > h) s.y = 0
    }
  }

  draw() {
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height
    const maxDist = 110

    ctx.clearRect(0, 0, w, h)

    // Lines between close stars
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const dx = this.stars[i].x - this.stars[j].x
        const dy = this.stars[i].y - this.stars[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35
          ctx.beginPath()
          ctx.moveTo(this.stars[i].x, this.stars[i].y)
          ctx.lineTo(this.stars[j].x, this.stars[j].y)
          ctx.strokeStyle = `rgba(160, 200, 255, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    }

    // Stars with twinkle
    for (const s of this.stars) {
      const glow = s.opacity * (0.75 + 0.25 * Math.sin(s.twinkle))
      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3)
      gradient.addColorStop(0, `rgba(220, 235, 255, ${glow})`)
      gradient.addColorStop(1, `rgba(100, 150, 255, 0)`)

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(240, 248, 255, ${glow})`
      ctx.fill()
    }
  }
}
