#!/usr/bin/env python3
"""
Nepali News Scraper with AI Processing

This script scrapes popular Nepali news and tech websites, processes the content
through OpenAI API, and outputs structured JSON data suitable for social media.

Author: Devroom Sidd
Version: 1.0.0
"""

import json
import re
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# Optional OpenAI import
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI package not installed. AI processing will be disabled.")
    print("To enable AI features, run: pip install openai")


@dataclass
class Article:
    """Data class for storing article information."""
    title: str
    description: str
    url: str
    source: str


@dataclass
class ProcessedArticle:
    """Data class for storing AI-processed article information."""
    title: str
    summary: str
    category: str
    hashtags: List[str]
    url: str


class NewsScraper(ABC):
    """Abstract base class for news scrapers."""
    
    def __init__(self, base_url: str, source_name: str):
        self.base_url = base_url
        self.source_name = source_name
        self.session = requests.Session()
        # Set a realistic user agent
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    @abstractmethod
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from the news website."""
        pass
    
    def _get_soup(self, url: str) -> Optional[BeautifulSoup]:
        """Get BeautifulSoup object for a given URL."""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""
        # Remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        # Remove special characters that might cause issues
        text = re.sub(r'[^\w\s\.,!?;:()\-]', '', text)
        return text


class OnlineKhabarScraper(NewsScraper):
    """Scraper for OnlineKhabar website."""
    
    def __init__(self):
        super().__init__("https://www.onlinekhabar.com", "OnlineKhabar")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from OnlineKhabar."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        # Find article containers (adjust selectors based on actual site structure)
        article_containers = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article|news)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                # Extract title
                title_elem = container.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'(title|headline)', re.I))
                if not title_elem:
                    title_elem = container.find(['a'])
                
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                # Extract URL
                link_elem = title_elem.find('a') or title_elem if title_elem.name == 'a' else container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                # Extract description/summary
                desc_elem = container.find(['p', 'div'], class_=re.compile(r'(excerpt|summary|desc)', re.I))
                if not desc_elem:
                    # Try to get first paragraph
                    desc_elem = container.find('p')
                
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class SetopatiScraper(NewsScraper):
    """Scraper for Setopati website."""
    
    def __init__(self):
        super().__init__("https://setopati.com", "Setopati")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from Setopati."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        # Find article containers
        article_containers = soup.find_all(['div', 'article'], class_=re.compile(r'(item|post|news)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                title_elem = container.find(['h2', 'h3', 'h4'])
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                link_elem = title_elem.find('a') or container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                desc_elem = container.find('p')
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class RatopatiScraper(NewsScraper):
    """Scraper for Ratopati website."""
    
    def __init__(self):
        super().__init__("https://ratopati.com", "Ratopati")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from Ratopati."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        article_containers = soup.find_all(['div', 'li'], class_=re.compile(r'(news|item)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                title_elem = container.find(['h2', 'h3', 'h4', 'a'])
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                link_elem = title_elem if title_elem.name == 'a' else container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                desc_elem = container.find('p')
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class MyRepublicaScraper(NewsScraper):
    """Scraper for MyRepublica website."""
    
    def __init__(self):
        super().__init__("https://myrepublica.nagariknetwork.com", "MyRepublica")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from MyRepublica."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        article_containers = soup.find_all(['div', 'article'], class_=re.compile(r'(story|article|news)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                title_elem = container.find(['h1', 'h2', 'h3'])
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                link_elem = title_elem.find('a') or container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                desc_elem = container.find(['p', 'div'], class_=re.compile(r'(summary|excerpt)', re.I))
                if not desc_elem:
                    desc_elem = container.find('p')
                
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class GadgetByteScraper(NewsScraper):
    """Scraper for GadgetByte website."""
    
    def __init__(self):
        super().__init__("https://www.gadgetbyte.com", "GadgetByte")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from GadgetByte."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        article_containers = soup.find_all(['article', 'div'], class_=re.compile(r'(post|article)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                title_elem = container.find(['h1', 'h2', 'h3'])
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                link_elem = title_elem.find('a') or container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                desc_elem = container.find(['p', 'div'], class_=re.compile(r'(excerpt|summary)', re.I))
                if not desc_elem:
                    desc_elem = container.find('p')
                
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class TechPanaScraper(NewsScraper):
    """Scraper for TechPana website."""
    
    def __init__(self):
        super().__init__("https://techpana.com", "TechPana")
    
    def scrape_articles(self, max_articles: int = 10) -> List[Article]:
        """Scrape articles from TechPana."""
        articles = []
        soup = self._get_soup(self.base_url)
        
        if not soup:
            return articles
        
        article_containers = soup.find_all(['div', 'article'], class_=re.compile(r'(post|article|item)', re.I))
        
        for container in article_containers[:max_articles]:
            try:
                title_elem = container.find(['h1', 'h2', 'h3', 'h4'])
                if not title_elem:
                    continue
                
                title = self._clean_text(title_elem.get_text())
                
                link_elem = title_elem.find('a') or container.find('a')
                if not link_elem:
                    continue
                
                url = urljoin(self.base_url, link_elem.get('href', ''))
                
                desc_elem = container.find('p')
                description = self._clean_text(desc_elem.get_text() if desc_elem else title)
                
                if title and url:
                    articles.append(Article(title, description, url, self.source_name))
                
            except Exception as e:
                print(f"Error parsing article from {self.source_name}: {e}")
                continue
        
        return articles


class AIProcessor:
    """Process articles using OpenAI API."""
    
    def __init__(self, api_key: str):
        """Initialize with OpenAI API key."""
        if not OPENAI_AVAILABLE:
            raise ImportError("OpenAI package is not installed. Install it with: pip install openai")
        self.client = OpenAI(api_key=api_key)
    
    def process_article(self, article: Article) -> Optional[ProcessedArticle]:
        """Process a single article through AI."""
        try:
            prompt = self._create_prompt(article)
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a social media content expert specializing in Nepali news and tech content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            result = response.choices[0].message.content.strip()
            return self._parse_ai_response(result, article.url)
            
        except Exception as e:
            print(f"Error processing article with AI: {e}")
            return None
    
    def _create_prompt(self, article: Article) -> str:
        """Create prompt for AI processing."""
        return f"""
        Please analyze this Nepali news/tech article and provide the following in JSON format:

        Title: {article.title}
        Description: {article.description}

        Provide:
        1. "catchy_title": A catchy, engaging title suitable for Instagram/TikTok (max 60 chars)
        2. "summary": A concise 1-2 sentence summary
        3. "category": One of: News, Tech, Politics, Entertainment, Sports
        4. "hashtags": 3-5 relevant hashtags as an array

        Format as valid JSON only, no additional text.
        """
    
    def _parse_ai_response(self, response: str, url: str) -> Optional[ProcessedArticle]:
        """Parse AI response into ProcessedArticle."""
        try:
            # Extract JSON from response if it contains extra text
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                data = json.loads(json_str)
                
                return ProcessedArticle(
                    title=data.get('catchy_title', ''),
                    summary=data.get('summary', ''),
                    category=data.get('category', 'News'),
                    hashtags=data.get('hashtags', []),
                    url=url
                )
            
        except Exception as e:
            print(f"Error parsing AI response: {e}")
        
        return None


class NewsScraperManager:
    """Main manager class for coordinating news scraping and AI processing."""
    
    def __init__(self, openai_api_key: Optional[str] = None):
        """Initialize with optional OpenAI API key."""
        self.scrapers = [
            OnlineKhabarScraper(),
            SetopatiScraper(),
            RatopatiScraper(),
            MyRepublicaScraper(),
            GadgetByteScraper(),
            TechPanaScraper()
        ]
        
        self.ai_processor = AIProcessor(openai_api_key) if (openai_api_key and OPENAI_AVAILABLE) else None
    
    def scrape_all_sites(self, articles_per_site: int = 5) -> List[Article]:
        """Scrape articles from all configured news sites."""
        all_articles = []
        
        for scraper in self.scrapers:
            print(f"Scraping {scraper.source_name}...")
            try:
                articles = scraper.scrape_articles(articles_per_site)
                all_articles.extend(articles)
                print(f"Found {len(articles)} articles from {scraper.source_name}")
                
                # Add small delay to be respectful to servers
                time.sleep(1)
                
            except Exception as e:
                print(f"Error scraping {scraper.source_name}: {e}")
        
        return all_articles
    
    def process_with_ai(self, articles: List[Article]) -> List[ProcessedArticle]:
        """Process articles with AI if API key is available."""
        if not self.ai_processor:
            print("No OpenAI API key provided. Skipping AI processing.")
            return []
        
        processed_articles = []
        
        for i, article in enumerate(articles):
            print(f"Processing article {i+1}/{len(articles)} with AI...")
            
            processed = self.ai_processor.process_article(article)
            if processed:
                processed_articles.append(processed)
            
            # Add delay to respect API rate limits
            time.sleep(0.5)
        
        return processed_articles
    
    def run(self, articles_per_site: int = 5, output_file: Optional[str] = None) -> Dict[str, Any]:
        """Run the complete scraping and processing pipeline."""
        print("Starting Nepali News Scraper...")
        print("=" * 50)
        
        # Step 1: Scrape articles
        print("Step 1: Scraping articles from news sites...")
        articles = self.scrape_all_sites(articles_per_site)
        print(f"\nTotal articles scraped: {len(articles)}")
        
        # Step 2: Process with AI (if available)
        processed_articles = []
        if self.ai_processor:
            print("\nStep 2: Processing articles with AI...")
            processed_articles = self.process_with_ai(articles)
            print(f"Total articles processed: {len(processed_articles)}")
        else:
            print("\nStep 2: Skipped (No OpenAI API key provided)")
            # Create basic processed articles without AI
            for article in articles:
                processed_articles.append(ProcessedArticle(
                    title=article.title,
                    summary=article.description,
                    category="News",
                    hashtags=["#Nepal", "#News"],
                    url=article.url
                ))
        
        # Step 3: Format output
        result = {
            "scraping_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_articles": len(processed_articles),
            "articles": [
                {
                    "title": article.title,
                    "summary": article.summary,
                    "category": article.category,
                    "hashtags": article.hashtags,
                    "url": article.url
                }
                for article in processed_articles
            ]
        }
        
        # Step 4: Output results
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"\nResults saved to: {output_file}")
        
        return result


def main():
    """Main function to run the news scraper."""
    import os
    
    print("Nepali News Scraper with AI Processing")
    print("=" * 50)
    
    # Get OpenAI API key from environment variable
    openai_api_key = os.getenv('OPENAI_API_KEY')
    
    if not openai_api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables.")
        print("AI processing will be skipped. Set OPENAI_API_KEY to enable AI features.")
        print()
    
    # Initialize and run scraper
    manager = NewsScraperManager(openai_api_key)
    
    try:
        # Run with 5 articles per site
        result = manager.run(articles_per_site=5, output_file="nepali_news_results.json")
        
        # Print formatted results
        print("\n" + "=" * 50)
        print("RESULTS:")
        print("=" * 50)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
    except KeyboardInterrupt:
        print("\nScraping interrupted by user.")
    except Exception as e:
        print(f"\nError running scraper: {e}")


if __name__ == "__main__":
    main()