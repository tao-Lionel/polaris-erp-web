/**
 * 动态计算table的高度
 */
export class LayoutManager {
  constructor({ contentAreaSelector, onResizeCallback, minHeight = 200, tableOption, page }) {
    this.contentArea = document.querySelector(contentAreaSelector)
    this.onResizeCallback = onResizeCallback
    this.minHeight = minHeight
    this.tableOption = tableOption
    this.page = page
    if (!this.contentArea) {
      throw new Error("One or more elements not found.")
    }

    this.updateContentHeight = this.updateContentHeight.bind(this)
    window.addEventListener("resize", this.updateContentHeight)

    this.updateContentHeight()
  }

  getElementBottomDistanceToViewportTop(element) {
    const elementRect = element.getBoundingClientRect()
    return window.innerHeight - elementRect.top
  }

  updateContentHeight() {
    if (this.page.total === null || this.page.total === undefined) {
      if (this.onResizeCallback) {
        this.onResizeCallback({ maxHeight: this.tableOption.maxHeight })
      }
      return
    }
    const distanceToViewportTop = this.getElementBottomDistanceToViewportTop(this.contentArea)
    const adjustedContentHeight = Math.max(
      this.minHeight,
      distanceToViewportTop - 65 - (this.tableOption.subtractedHeight || 0) // 减去特殊的高度
    )
    if (this.onResizeCallback) {
      this.onResizeCallback({ contentHeight: adjustedContentHeight, maxHeight: adjustedContentHeight })
    }
  }

  destroy() {
    window.removeEventListener("resize", this.updateContentHeight)
  }
}

export function createLayoutManager(options) {
  return new LayoutManager(options)
}
