# ChromaCorrect Chrome Extension
**Assisting colorblind users to accurately see, differentiate, and inspect graphs, charts, and graphical web images.**

## Features
- **Daltonization Filter Engine**: Shifts confusable wavelengths (e.g. Deuteranopia red/green, Protanopia red, Tritanopia blue) into high-visibility visible bands.
- **Texture & Hatching Injection**: Adds diagonal stripes, polka dots, and crosshatches to charts so data series do not depend solely on color.
- **Live Color Name Eyedropper**: Hover over any chart slice or trendline to see its human color name and hex value.
- **High-Contrast Boundary Outlines**: Draws high-contrast outlines between adjacent chart slices.
- **Web Image & Diagram Color Correction**: Automatically detects web graphics, infographics, satellite maps, and diagrammatic `<img>` tags, applying Daltonization and contrast boost in real-time.
- **Dynamic DOM Mutation Observer**: Automatically color-corrects newly rendered or dynamically loaded images on infinite-scroll pages and single-page apps.
- **Works on**: D3, Chart.js, Recharts, Plotly, Highcharts, SVG, Canvas, and general web images.

## Installation in Google Chrome
1. Download or extract the `chromacorrect-extension` folder.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. In the top-right corner, toggle on **Developer mode**.
4. Click the **Load unpacked** button in the top-left toolbar.
5. Select the extracted `chromacorrect-extension` directory.
6. Click the Extensions puzzle piece icon in your Chrome toolbar and pin **ChromaCorrect**.
7. Open any website with charts (or the provided simulator) and click the ChromaCorrect icon!
