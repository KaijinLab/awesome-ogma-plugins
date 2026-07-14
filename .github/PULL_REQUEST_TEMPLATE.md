## Plugin Submission

**Plugin name:**
**Repository URL:**
**Your GitHub username:**

---

## Submission checklist

Before opening this PR, confirm each item below.

### Plugin files

- [ ] `manifest.json` is present and valid
- [ ] `id` in manifest is lowercase, uses only letters, digits, and hyphens
- [ ] `version` follows semver (e.g. `1.0.0`)
- [ ] `dist/` directory is included with compiled output
- [ ] `README.md` explains what the plugin does
- [ ] `LICENSE` file is present

### Code review

- [ ] Source code is available (not just compiled output)
- [ ] No obfuscated code
- [ ] No calls to external servers that are not documented
- [ ] Permissions declared in `manifest.json` match actual usage
- [ ] Plugin does not crash Ogma on install or enable

### plugins.json entry

- [ ] Entry added to `plugins.json` in alphabetical order by `id`
- [ ] All required fields are present (`id`, `name`, `version`, `description`, `author`, `homepage`, `download`, `sha256`, `tags`, `ogma_min_version`, `permissions`)
- [ ] `download` URL points to a real, downloadable `.zip`
- [ ] `id` is unique (not already in the registry)
- [ ] At least one valid tag from the tag list in CONTRIBUTING.md

### Testing

- [ ] Plugin installs without errors in Ogma
- [ ] Plugin enables without errors
- [ ] Core functionality works as described

---

## Description

Briefly describe what the plugin does and why it is useful for security testing.

## Notes for reviewers

Any context that helps the reviewer (e.g., permissions used and why, tested on Ogma version X).
