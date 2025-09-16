# Nepali News Scraper with AI Processing

A Python script that scrapes popular Nepali news and tech websites, processes content through OpenAI API, and outputs structured JSON data perfect for social media content creation.

## 🌟 Features

- **Multi-site Scraping**: Scrapes 6 popular Nepali websites:
  - OnlineKhabar
  - Setopati  
  - Ratopati
  - MyRepublica
  - GadgetByte
  - TechPana

- **AI Content Processing**: Uses OpenAI API to:
  - Create catchy, social media-ready titles
  - Generate concise summaries (1-2 sentences)
  - Categorize content (News, Tech, Politics, Entertainment, Sports)
  - Suggest relevant hashtags

- **Structured Output**: Clean JSON format with all processed data
- **Modular Design**: Easy to add/remove websites
- **Beginner Friendly**: Simple, well-documented code
- **Rate Limiting**: Respectful to website servers

## 📋 Requirements

- Python 3.7 or higher
- Internet connection
- OpenAI API key (optional, but recommended for full functionality)

## 🚀 Installation

### Step 1: Clone or Download

If you're working in an existing project directory, the files are already there. Otherwise:

```bash
git clone <repository-url>
cd devroom-sidd
```

### Step 2: Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:

```bash
pip install requests beautifulsoup4 openai lxml
```

### Step 3: Set Up OpenAI API Key (Optional but Recommended)

#### Option A: Environment Variable (Recommended)

**Windows:**
```cmd
set OPENAI_API_KEY=your_api_key_here
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY=your_api_key_here
```

#### Option B: Create a .env file

Create a file named `.env` in the same directory as the script:

```
OPENAI_API_KEY=your_api_key_here
```

**Note**: The script will work without an OpenAI API key, but AI processing features will be skipped.

## 🔑 Getting an OpenAI API Key

1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the key and use it in step 3 above

**Cost**: OpenAI API usage is pay-per-use. Processing ~30 articles typically costs less than $0.10.

## 🎯 Usage

### Basic Usage

```bash
python news_scraper.py
```

This will:
- Scrape 5 articles from each news site (30 total)
- Process them with AI (if API key is available)
- Save results to `nepali_news_results.json`
- Display formatted output in the console

### Example Output

```json
{
  "scraping_timestamp": "2024-01-15 14:30:25",
  "total_articles": 25,
  "articles": [
    {
      "title": "🚀 Nepal's Tech Revolution: New Startup Boom!",
      "summary": "Nepal sees unprecedented growth in tech startups with 50+ new companies launched this year.",
      "category": "Tech",
      "hashtags": ["#NepalTech", "#Startup", "#Innovation", "#TechNews"],
      "url": "https://example.com/article-url"
    }
  ]
}
```

## 🛠️ Customization

### Adding New Websites

To add a new news website, create a new scraper class:

```python
class NewWebsiteScraper(NewsScraper):
    def __init__(self):
        super().__init__("https://newwebsite.com", "NewWebsite")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        # Implement scraping logic
        pass
```

Then add it to the `NewsScraperManager`:

```python
self.scrapers = [
    # ... existing scrapers ...
    NewWebsiteScraper()
]
```

### Changing Article Count

Modify the `articles_per_site` parameter:

```python
result = manager.run(articles_per_site=10)  # Get 10 articles per site
```

### Customizing AI Prompts

Edit the `_create_prompt` method in the `AIProcessor` class to change how articles are processed.

## 🔧 Troubleshooting

### Common Issues

**1. ImportError: No module named 'requests'**
```bash
pip install requests beautifulsoup4 openai lxml
```

**2. OpenAI API Error**
- Check your API key is correct
- Ensure you have API credits available
- Verify internet connection

**3. Website Scraping Issues**
- Some websites may have changed their structure
- Try running with fewer sites first
- Check if websites are accessible

**4. No Articles Found**
- Website structures may have changed
- Some sites may be blocking automated access
- Try with a different website first

### Debug Mode

To see detailed error messages, modify the exception handling in the script or add print statements.

## 📁 Output Files

- `nepali_news_results.json`: Complete results with all processed articles
- Console output: Formatted display of all results

## 🚦 Rate Limiting & Ethics

The script includes built-in delays to be respectful to website servers:
- 1 second delay between website scrapes
- 0.5 second delay between AI API calls

**Please use responsibly:**
- Don't run the script too frequently
- Respect website terms of service
- Consider reaching out to websites for API access if available

## 📜 Script Structure

```
news_scraper.py
├── Article (Data class)
├── ProcessedArticle (Data class)  
├── NewsScraper (Abstract base class)
│   ├── OnlineKhabarScraper
│   ├── SetopatiScraper
│   ├── RatopatiScraper
│   ├── MyRepublicaScraper
│   ├── GadgetByteScraper
│   └── TechPanaScraper
├── AIProcessor (OpenAI integration)
└── NewsScraperManager (Main coordinator)
```

## 🔄 Workflow

1. **Scraping Phase**: Each scraper extracts articles from its assigned website
2. **AI Processing Phase**: OpenAI API processes each article for social media optimization
3. **Output Phase**: Results are formatted as JSON and saved/displayed

## 🎨 Social Media Ready

The processed output is optimized for:
- **Instagram**: Catchy titles under 60 characters
- **TikTok**: Engaging, short descriptions
- **Twitter**: Relevant hashtags for discovery
- **Facebook**: Categorized content for proper targeting

## 🤝 Contributing

Feel free to:
- Add more news websites
- Improve scraping accuracy
- Enhance AI prompts
- Add new output formats
- Report bugs or issues

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all dependencies are installed
3. Test with a simple example first
4. Check your internet connection and API keys

## 📄 License

This project is for educational and personal use. Please respect the terms of service of the websites being scraped and the OpenAI API terms of use.

---

**Happy Scraping! 🚀**

*Made with ❤️ for the Nepali tech community*