# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-20

### Added
- IntelliSense support for theme utilities by automatically generating theme.css in node_modules
- GitHub Pages deployment workflow for live demo
- Comprehensive CLAUDE.md documentation for development

### Fixed
- ESM import compatibility issues with dynamic file generation
- Theme CSS generation now respects configurable prefix for IntelliSense

### Changed
- Extended Vite peer dependency to support 7.0+ (previously supported 6.0+)
- Improved documentation with live demo link and better examples

## [1.0.0] - 2025-01-20

### Added
- Initial release of Tailwind Color Theme Plugin
- Dynamic color theming with CSS variables
- Built-in dark/light mode support with adaptive shade shifting
- Semantic color utilities (text-default, bg-muted, border-accented, etc.)
- Custom CSS variables injection
- Framework agnostic support (Vue, React, Svelte, etc.)
- TypeScript support
- User @theme override detection
- Configurable prefix and color options
- Adaptive shades functionality
- Complete example project with ThemePicker component
- Support for Vite 6.0+ and Tailwind CSS 4.0+