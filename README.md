# Bright Data Plugin for OpenClaw

Web search, scraping, browser automation, and 50+ structured data tools — powered by [Bright Data](https://brightdata.com).

## Install

```bash
openclaw plugins install @brightdata/brightdata-plugin
```

## Configure

Set your Bright Data API token (get one at [brightdata.com](https://brightdata.com)):

```bash
# Option A: environment variable
export BRIGHTDATA_API_TOKEN=your_token

# Option B: OpenClaw config
openclaw config set plugins.entries.brightdata.config.webSearch.apiKey your_token
```

The plugin auto-creates two proxy zones on first use: `mcp_unlocker` (Web Unlocker) and `mcp_browser` (Browser API). To use existing zones:

```bash
export BRIGHTDATA_UNLOCKER_ZONE=my_unlocker_zone
export BRIGHTDATA_BROWSER_ZONE=my_browser_zone
```

## What's Included

**66 tools** across five categories:

| Category | Tools | Description |
|----------|-------|-------------|
| [Search](#search) | 2 | Web search via Google, Bing, Yandex with geo-targeting |
| [Scrape](#scrape) | 1 | Page extraction as markdown, text, or HTML — handles bot protection |
| [Batch](#batch) | 2 | Parallel search and scrape (up to 5 items) |
| [Browser](#browser-automation) | 14 | Full browser automation via Playwright CDP |
| [Web Data](#web-data) | 47 | Structured data from Amazon, LinkedIn, Instagram, TikTok, and more |

---

### Search

The plugin registers as an OpenClaw **web search provider** — it appears in provider selection automatically.

| Tool | Description |
|------|-------------|
| `brightdata_search` | Search Google, Bing, or Yandex with pagination, geo-targeting, and result count control |

```
Parameters: query (required), engine ("google"|"bing"|"yandex"), count (1-10),
            cursor, geo_location (2-letter ISO), timeoutSeconds
```

### Scrape

| Tool | Description |
|------|-------------|
| `brightdata_scrape` | Fetch and extract a page through Bright Data Web Unlocker, including bot-protected pages |

```
Parameters: url (required), extractMode ("markdown"|"text"|"html"), maxChars (≥100), timeoutSeconds
```

### Batch

| Tool | Description |
|------|-------------|
| `brightdata_search_batch` | Run up to 5 search queries in parallel |
| `brightdata_scrape_batch` | Scrape up to 5 URLs in parallel |

### Browser Automation

Full browser control via Bright Data's residential proxy network. Sessions are scoped per user context and idle-timeout after 10 minutes.

| Tool | Description |
|------|-------------|
| `brightdata_browser_navigate` | Navigate to a URL (optional country routing) |
| `brightdata_browser_go_back` | Go back |
| `brightdata_browser_go_forward` | Go forward |
| `brightdata_browser_snapshot` | Capture ARIA snapshot with interactive element refs |
| `brightdata_browser_click` | Click an element by ref |
| `brightdata_browser_type` | Type into an element by ref (optional submit) |
| `brightdata_browser_screenshot` | Take a screenshot (viewport or full page) |
| `brightdata_browser_get_html` | Get page HTML |
| `brightdata_browser_get_text` | Get page text content |
| `brightdata_browser_scroll` | Scroll to bottom |
| `brightdata_browser_scroll_to` | Scroll to a specific element by ref |
| `brightdata_browser_wait_for` | Wait for an element to be visible |
| `brightdata_browser_network_requests` | List network requests since page load |
| `brightdata_browser_fill_form` | Fill multiple form fields in one operation |

### Web Data

Structured data extraction from 47 platforms via Bright Data datasets. Each tool accepts a `url` or `keyword` input and returns structured JSON.

<details>
<summary>All 47 dataset tools</summary>

**E-commerce**
| Tool | Platform |
|------|----------|
| `brightdata_amazon_product` | Amazon product details |
| `brightdata_amazon_product_reviews` | Amazon reviews |
| `brightdata_amazon_product_search` | Amazon search results |
| `brightdata_walmart_product` | Walmart product details |
| `brightdata_walmart_seller` | Walmart seller info |
| `brightdata_ebay_product` | eBay product details |
| `brightdata_homedepot_products` | Home Depot products |
| `brightdata_zara_products` | Zara products |
| `brightdata_etsy_products` | Etsy products |
| `brightdata_bestbuy_products` | Best Buy products |

**Professional Networks**
| Tool | Platform |
|------|----------|
| `brightdata_linkedin_person_profile` | LinkedIn person profile |
| `brightdata_linkedin_company_profile` | LinkedIn company profile |
| `brightdata_linkedin_job_listings` | LinkedIn jobs |
| `brightdata_linkedin_posts` | LinkedIn posts |
| `brightdata_linkedin_people_search` | LinkedIn people search |
| `brightdata_crunchbase_company` | Crunchbase company data |
| `brightdata_zoominfo_company_profile` | ZoomInfo company profile |

**Social Media — Instagram**
| Tool | Platform |
|------|----------|
| `brightdata_instagram_profiles` | Instagram profiles |
| `brightdata_instagram_posts` | Instagram posts |
| `brightdata_instagram_reels` | Instagram reels |
| `brightdata_instagram_comments` | Instagram comments |

**Social Media — Facebook**
| Tool | Platform |
|------|----------|
| `brightdata_facebook_posts` | Facebook posts |
| `brightdata_facebook_marketplace_listings` | Facebook Marketplace |
| `brightdata_facebook_company_reviews` | Facebook company reviews |
| `brightdata_facebook_events` | Facebook events |

**Social Media — TikTok**
| Tool | Platform |
|------|----------|
| `brightdata_tiktok_profiles` | TikTok profiles |
| `brightdata_tiktok_posts` | TikTok posts |
| `brightdata_tiktok_shop` | TikTok Shop |
| `brightdata_tiktok_comments` | TikTok comments |

**Social Media — X (Twitter)**
| Tool | Platform |
|------|----------|
| `brightdata_x_posts` | X posts |
| `brightdata_x_profile_posts` | X profile posts |

**Social Media — YouTube & Reddit**
| Tool | Platform |
|------|----------|
| `brightdata_youtube_profiles` | YouTube profiles |
| `brightdata_youtube_videos` | YouTube videos |
| `brightdata_youtube_comments` | YouTube comments |
| `brightdata_reddit_posts` | Reddit posts |

**Maps, Shopping & Apps**
| Tool | Platform |
|------|----------|
| `brightdata_google_maps_reviews` | Google Maps reviews |
| `brightdata_google_shopping` | Google Shopping |
| `brightdata_google_play_store` | Google Play Store |
| `brightdata_apple_app_store` | Apple App Store |

**Finance, News & Code**
| Tool | Platform |
|------|----------|
| `brightdata_reuter_news` | Reuters news |
| `brightdata_yahoo_finance_business` | Yahoo Finance |
| `brightdata_github_repository_file` | GitHub repository files |

**Real Estate & Travel**
| Tool | Platform |
|------|----------|
| `brightdata_zillow_properties_listing` | Zillow listings |
| `brightdata_booking_hotel_listings` | Booking.com hotels |

**AI Insights**
| Tool | Platform |
|------|----------|
| `brightdata_chatgpt_ai_insights` | ChatGPT responses |
| `brightdata_grok_ai_insights` | Grok responses |
| `brightdata_perplexity_ai_insights` | Perplexity responses |

</details>

---

## Configuration Reference

| Setting | Env Var | Config Path | Default |
|---------|---------|-------------|---------|
| API Token | `BRIGHTDATA_API_TOKEN` | `...webSearch.apiKey` | *required* |
| Base URL | `BRIGHTDATA_BASE_URL` | `...webSearch.baseUrl` | `https://api.brightdata.com` |
| Unlocker Zone | `BRIGHTDATA_UNLOCKER_ZONE` | `...webSearch.unlockerZone` | `mcp_unlocker` |
| Browser Zone | `BRIGHTDATA_BROWSER_ZONE` | `...webSearch.browserZone` | `mcp_browser` |
| Timeout | — | `...webSearch.timeoutSeconds` | `30` (search) / `60` (scrape) |
| Polling Timeout | — | `...webSearch.pollingTimeoutSeconds` | `600` |

Config paths are prefixed with `plugins.entries.brightdata.config`.

Environment variables take priority over config file values.

## Plugin Management

```bash
# Install
openclaw plugins install @brightdata/brightdata-plugin

# Verify
openclaw plugins inspect brightdata

# Disable / re-enable
openclaw plugins disable brightdata
openclaw plugins enable brightdata

# Update
openclaw plugins update brightdata

# Uninstall
openclaw plugins uninstall brightdata
```

## License

MIT
