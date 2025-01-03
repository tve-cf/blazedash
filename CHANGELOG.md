# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- 2025-01-03: Simplified export functionality in analytics table
  - Removed PDF export option
  - Removed zone and date range information from exports
  - CSV exports now only include data headers and rows
  - Excel exports now have a single sheet with table data
  - Added proper column width formatting in Excel exports
  - Added proper data formatting for numbers and bytes 