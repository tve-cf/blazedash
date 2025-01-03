# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 2025-01-03: Added month picker mode to date range picker with year navigation and quick month selection
- 2025-01-03: Added support for setting API token via environment variables
- 2025-01-03: Added page size selector to analytics table (10, 100, 500, 1000 rows)
- 2025-01-03: Added floating scroll to top button in analytics table

### Changed
- 2025-01-03: Enhanced analytics table UI:
  - Added sticky header and footer with improved scrolling
  - Fixed column widths to prevent resizing when navigating pages
  - Added scroll indicators with gradient overlays
  - Improved scrollbar visibility and interaction
  - Made subtotal row more informative with hover tooltip
  - Fixed scroll to top button positioning
- 2025-01-03: Simplified analytics table exports with better formatting and data handling
- 2025-01-03: Restricted date range picker to prevent future date selection in both calendar and month views