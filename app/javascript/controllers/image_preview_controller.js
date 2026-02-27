import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "preview", "img"]

  show() {
    const file = this.inputTarget.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      this.imgTarget.src = e.target.result
      this.previewTarget.style.display = "block"
    }
    reader.readAsDataURL(file)
  }
}
