# YouTube Shorts Redirect

A lightweight Firefox extension that automatically redirects YouTube Shorts URLs to regular YouTube watch URLs for a better viewing experience.

## URL Transformations

### YouTube Shorts → Watch URLs
```
Before: https://www.youtube.com/shorts/nxDBd-LCRWM
After:  https://www.youtube.com/watch?v=nxDBd-LCRWM
```

Also handles:
- `https://m.youtube.com/shorts/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`
- Query parameters: `https://www.youtube.com/shorts/VIDEO_ID?feature=share`

### youtu.be Share Links → Full URLs
```
Before: https://youtu.be/VIDEO_ID
After:  https://www.youtube.com/watch?v=VIDEO_ID
```

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory
5. The extension is now active

### From Firefox Add-ons (Coming Soon)

The extension will be submitted to the official Firefox Add-ons marketplace.

## How It Works

This extension uses Firefox's `declarativeNetRequest` API to redirect URLs at the browser level before the page loads. This approach:

- Provides instant, seamless redirects
- Uses minimal system resources
- Respects your privacy (no JavaScript inspection of URLs)
- Works with Manifest V3 for future compatibility

## Privacy

This extension:
- Does NOT collect any data
- Does NOT track your browsing
- Does NOT make external network requests
- Does NOT log or store URLs
- Only requests permissions necessary for URL redirection

**Permissions Used:**
- `declarativeNetRequest` - Required to redirect URLs
- Host permissions for `youtube.com` and `youtu.be` - Required to match YouTube URLs

## Testing

Test the extension with these URLs:

1. https://www.youtube.com/shorts/nxDBd-LCRWM
2. https://m.youtube.com/shorts/dQw4w9WgXcQ
3. https://youtube.com/shorts/jNQXAC9IVRw
4. https://youtu.be/dQw4w9WgXcQ
5. https://www.youtube.com/shorts/VIDEO_ID?feature=share

All should redirect to their `watch?v=` equivalents automatically.

## Technical Details

- **Manifest Version:** 3
- **API Used:** declarativeNetRequest
- **Browser Support:** Firefox (Manifest V3 compatible)
- **Performance:** Native browser-level redirection (no overhead)

### Building / Installation

To create a distributable `.xpi` file:

```bash
./build.sh
```

This will create `yt-unshort-{version}.xpi` which can be installed directly in Firefox

### Modifying Redirect Rules

Edit `rules.json` to customize the redirect behavior. The file contains regex-based rules that match URL patterns and define substitution patterns.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use and modify as needed.

