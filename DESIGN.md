# OneStopSite System Architecture & Design Documentation

This document outlines the technical design, competitor analysis, and key architectural choices for the **OneStopSite** 88x31 retro button builder.

---

## 1. Competitor Analysis & Identified Weaknesses

We analyzed the current leading competitor: **Websets by Lynn (88x31 Button Maker)** at `https://websetsbylynn.neocities.org/88x31-button-maker/`. While functional, the generator suffers from critical architectural and UX limitations:

### A. Blurry DOM Rendering (`html2canvas`)
*   **Weakness:** The competitor uses `html2canvas` to capture absolute-positioned DOM nodes. This results in fuzzy, poorly anti-aliased images, missing pixel fonts, and inconsistent cross-browser renders.
*   **Solution:** OneStopSite implements a pure **HTML5 Canvas rendering engine** using nearest-neighbor interpolation (`image-rendering: pixelated` and `imageSmoothingEnabled = false`), ensuring razor-sharp pixel graphics.

### B. Lack of Timeline Animations (GIF support)
*   **Weakness:** The competitor can only generate static PNG buttons. Retro web badges are famously animated (flashing, scrollings, blinking stars).
*   **Solution:** We built a custom **Keyframe Timeline Animator** and integrated the modern lightweight LZW encoder `gifenc` to write canvas buffers directly into animated GIFs client-side.

### C. Primitive Flat Layers
*   **Weakness:** User cannot reorder, rename, lock, change opacity, or toggle visibility of elements. It is restricted to a rigid structure (one background image, one main image, one text box).
*   **Solution:** We created a fully editable **Photoshop-like Layers Stack**. Users can add unlimited text, shape, image, and filter overlay layers, rename them, set opacity, change blending modes (multiply, screen, overlay), and drag to reorder.

### D. Outdated Visuals & No Autosave
*   **Weakness:** Simple text areas and buttons. All progress is lost instantly upon page reload.
*   **Solution:** Designed a premium **Vercel-inspired UI** (pure dark mode, thin borders, micro-animations, Geist sans-serif, and monospace typography). Implemented browser **LocalStorage Autosave** so states persist across tabs.

---

## 2. Technical Stack & SEO Architecture

OneStopSite is designed as a **Multi-Page Application (MPA)** using **AstroJS** and **Tailwind CSS v4** to maximize performance and SEO rankings.

### Page Directory Structure & SEO Targets
*   **Home Page (`/`):** [index.astro](file:///C:/Users/Kaartik/Documents/Kaartik/Code/web/src/pages/index.astro)
    *   *SEO Target:* High-converting landing page highlighting features, comparison charts, and CTA to enter the editor.
*   **Editor Workspace (`/editor`):** [editor.astro](file:///C:/Users/Kaartik/Documents/Kaartik/Code/web/src/pages/editor.astro)
    *   *SEO Target:* Interactive app view. Loads template presets (win95, cyberpunk, etc.) via URL search parameters.
*   **Presets Directory (`/templates`):** [templates.astro](file:///C:/Users/Kaartik/Documents/Kaartik/Code/web/src/pages/templates.astro)
    *   *SEO Target:* Targets search terms like *"free 88x31 templates"*, *"Windows 95 button presets"*.
*   **Public Gallery (`/gallery`):** [gallery.astro](file:///C:/Users/Kaartik/Documents/Kaartik/Code/web/src/pages/gallery.astro)
    *   *SEO Target:* Catalog of vintage web badges with copyable HTML codes.
*   **History & Education (`/about`):** [about.astro](file:///C:/Users/Kaartik/Documents/Kaartik/Code/web/src/pages/about.astro)
    *   *SEO Target:* Educational FAQs targeting long-tail searches on GeoCities/Neocities link exchanges.

---

## 3. Data Structures & Canvas Pipeline

The editor maintains project states using simple serializable JSON structures to support exports/imports.

### Interface Definitions
```typescript
interface Layer {
  id: string;
  name: string;
  type: 'background' | 'text' | 'image' | 'shape' | 'overlay';
  visible: boolean;
  opacity: number;      // 0 to 100
  blendMode: string;    // source-over, multiply, screen, overlay etc.
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // ... (type-specific properties)
}

interface Frame {
  id: string;
  delay: number;        // frame delay in ms
  overrides: Record<string, Partial<Layer>>; // keyframe overrides per layer
}
```

### Rendering Loop
The rendering engine in `editor.astro` maps through layers from bottom to top, applying frame-specific keyframe overrides dynamically:

```javascript
function drawCanvasFrame(ctx, frameIdx) {
  ctx.clearRect(0, 0, 88, 31);
  project.layers.forEach(layer => {
    const eff = getLayerEffective(layer, frameIdx); // Merges overrides
    if (!eff.visible) return;
    
    ctx.save();
    ctx.globalAlpha = eff.opacity / 100;
    ctx.globalCompositeOperation = eff.blendMode;
    
    // Draw background color / gradient
    // Draw image / shapes
    // Render text with outlining (ctx.strokeText) and drop-shadows
    ctx.restore();
  });
}
```

---

## 4. UI Interaction & UX Highlights

1.  **Figma Selection Handles:** When selecting a layer, a boundary box overlays the viewport, containing scale anchors. Dragging inside the box nudges the coordinates, while dragging anchors resizes vectors.
2.  **Web 1.0 Overlay Filters:** Pre-configured raster algorithms rendering **horizontal scanlines**, **diagonal striping**, **noise grids**, and classic **3D beveled windows borders** natively inside 2D Canvas contexts.
3.  **High-DPI Upscaled Exports:** Since 88x31 is tiny on modern 4K/retina displays, users can export static PNGs and animated GIFs at upscaled sizes (1x, 2x, 4x, 8x), utilizing nearest-neighbor upscaling to preserve crisp retro pixel edges.
