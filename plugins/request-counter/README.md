# Request Counter -- Ogma Plugin

Counts intercepted HTTP requests. Reference plugin demonstrating the minimal Ogma plugin structure.

## Install

Copy this directory to a location on disk. In Ogma, go to **Settings > Plugins > Install**, enter the directory path, and enable the plugin.

## Project structure

```
request-counter/
  manifest.json     -- plugin descriptor
  dist/
    backend.js      -- backend entry point
    frontend.js     -- frontend entry point
    style.css       -- frontend styles
  README.md
  LICENSE
```

Note: this is a plain JavaScript plugin. No build step required.

## Developer Notes

This plugin uses the Ogma short-form manifest. Instead of a verbose `plugins` array, it uses top-level `backend` and `frontend` keys pointing to `dist/`:

```json
{
  "backend": "dist/backend.js",
  "frontend": { "entrypoint": "dist/frontend.js", "style": "dist/style.css" }
}
```

For the full manifest specification, see the [Ogma Plugin SDK](../../PLUGIN_SPEC.md).

### Key constraints

- The backend runs in a QuickJS sandbox. No `import`, no `require`, no `fetch`.
- All `sdk.*` data methods are asynchronous. Use `await`.
- The frontend runs in a sandboxed iframe (`allow-scripts` only). No `localStorage`. No external scripts at runtime.

## License

MIT
