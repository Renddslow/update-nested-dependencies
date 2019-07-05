# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## [1.0.1] - 2019-07-04

### Fixed

- Fixed a bug that would cause the dependency visitor to recurse until it ran out of memory. Whoops.
- If a package is on an `rc` version, the version will be raised to the next patch version and `rc-1` appended to the version.

---
