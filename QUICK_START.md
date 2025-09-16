# Quick Start Guide - Nepali News Scraper

## 🚀 How to Run the Script on Your Local Computer

### 1. Prerequisites
- Python 3.7+ installed on your computer
- Internet connection

### 2. Download Files
Download these files to a folder on your computer:
- `news_scraper.py`
- `requirements.txt`
- `NEWS_SCRAPER_README.md` (for detailed documentation)

### 3. Install Dependencies
Open Terminal/Command Prompt and navigate to the folder:

```bash
cd path/to/your/folder
pip install -r requirements.txt
```

Or install individually:
```bash
pip install requests beautifulsoup4 lxml
```

For AI features (optional):
```bash
pip install openai
```

### 4. Get OpenAI API Key (Optional but Recommended)
1. Go to https://platform.openai.com/
2. Create account and get API key
3. Set environment variable:

**Windows:**
```cmd
set OPENAI_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
export OPENAI_API_KEY=your_api_key_here
```

### 5. Run the Script
```bash
python news_scraper.py
```

### 6. View Results
- Check console output for formatted results
- Find detailed JSON in `nepali_news_results.json`

## 📋 Expected Output

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

## 🔧 Troubleshooting

**Can't install packages?**
```bash
python -m pip install --user requests beautifulsoup4 lxml
```

**No internet access to some sites?**
- This is normal, some sites may block automated access
- The script will continue with available sites

**Want to test without internet?**
```bash
python test_scraper.py
```

## 📞 Need Help?
Check the full documentation in `NEWS_SCRAPER_README.md` for detailed troubleshooting and customization options.

---
**Ready to go! 🎉 Your Nepali news scraper is set up and ready to create social media content.**