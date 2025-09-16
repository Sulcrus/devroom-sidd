#!/usr/bin/env python3
"""
Test script for Nepali News Scraper

This script demonstrates the functionality with mock data 
since we can't access real websites in this environment.
"""

import json
from news_scraper import Article, ProcessedArticle, NewsScraperManager


def create_mock_articles():
    """Create mock articles for testing purposes."""
    return [
        Article(
            title="Nepal's Digital Banking Revolution: Siddhartha Bank Leads Innovation",
            description="Siddhartha Bank introduces cutting-edge digital services with mobile banking app featuring biometric authentication and AI-powered financial insights.",
            url="https://example.com/siddhartha-bank-digital",
            source="TechPana"
        ),
        Article(
            title="Kathmandu Smart City Project Gets Government Approval",
            description="The government has approved the ambitious Kathmandu Smart City project worth $2 billion, focusing on traffic management and digital infrastructure.",
            url="https://example.com/kathmandu-smart-city",
            source="MyRepublica"
        ),
        Article(
            title="Electric Vehicle Sales Surge 300% in Nepal This Year",
            description="Nepal sees unprecedented growth in electric vehicle adoption with over 15,000 EVs sold this year, driven by government incentives and charging infrastructure.",
            url="https://example.com/ev-sales-nepal",
            source="GadgetByte"
        ),
        Article(
            title="UNESCO Declares New World Heritage Site in Nepal",
            description="Rara Lake area has been declared a UNESCO World Heritage Site, recognizing its unique biodiversity and cultural significance to local communities.",
            url="https://example.com/rara-unesco",
            source="OnlineKhabar"
        ),
        Article(
            title="Nepal's First Tech Unicorn: Payment Platform Reaches $1B Valuation",
            description="eSewa becomes Nepal's first unicorn startup after securing $200M in Series C funding, valued at over $1 billion by international investors.",
            url="https://example.com/esewa-unicorn",
            source="Setopati"
        )
    ]


def mock_ai_processing(articles):
    """Mock AI processing to demonstrate expected output format."""
    processed = []
    
    ai_responses = [
        {
            "catchy_title": "🏦 Nepal's Banking Gets AI Makeover!",
            "summary": "Siddhartha Bank launches revolutionary digital services with biometric auth and AI insights.",
            "category": "Tech",
            "hashtags": ["#NepalTech", "#DigitalBanking", "#AI", "#Innovation", "#SiddharthaBank"]
        },
        {
            "catchy_title": "🌆 Kathmandu Goes Smart: $2B Project Approved!",
            "summary": "Government approves massive $2B smart city initiative for Kathmandu's digital transformation.",
            "category": "News",
            "hashtags": ["#SmartCity", "#Kathmandu", "#Technology", "#Infrastructure", "#Nepal"]
        },
        {
            "catchy_title": "⚡ EV Revolution: 300% Sales Boom in Nepal!",
            "summary": "Nepal's electric vehicle market explodes with 15,000+ EVs sold this year alone.",
            "category": "Tech",
            "hashtags": ["#ElectricVehicles", "#GreenNepal", "#Sustainability", "#EVs", "#CleanEnergy"]
        },
        {
            "catchy_title": "🏔️ Rara Lake Joins UNESCO World Heritage!",
            "summary": "Beautiful Rara Lake area receives prestigious UNESCO World Heritage status.",
            "category": "News",
            "hashtags": ["#UNESCO", "#RaraLake", "#WorldHeritage", "#Nepal", "#Tourism"]
        },
        {
            "catchy_title": "🦄 Nepal's First Unicorn: eSewa Hits $1B!",
            "summary": "eSewa makes history as Nepal's first billion-dollar startup after major funding round.",
            "category": "Tech",
            "hashtags": ["#Unicorn", "#eSewa", "#Fintech", "#Startup", "#NepalTech"]
        }
    ]
    
    for i, article in enumerate(articles):
        if i < len(ai_responses):
            response = ai_responses[i]
            processed.append(ProcessedArticle(
                title=response["catchy_title"],
                summary=response["summary"],
                category=response["category"],
                hashtags=response["hashtags"],
                url=article.url
            ))
    
    return processed


def main():
    """Main function to demonstrate the scraper with mock data."""
    print("Nepali News Scraper - Test Mode")
    print("=" * 50)
    print("Note: Using mock data since real websites aren't accessible")
    print()
    
    # Create mock articles
    mock_articles = create_mock_articles()
    print(f"Created {len(mock_articles)} mock articles")
    
    # Simulate AI processing
    processed_articles = mock_ai_processing(mock_articles)
    print(f"Processed {len(processed_articles)} articles with mock AI")
    
    # Format output like the real scraper
    result = {
        "scraping_timestamp": "2024-01-15 14:30:25",
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
    
    # Save results
    output_file = "mock_news_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults saved to: {output_file}")
    
    # Display formatted results
    print("\n" + "=" * 50)
    print("MOCK RESULTS PREVIEW:")
    print("=" * 50)
    
    for i, article in enumerate(result["articles"][:3], 1):
        print(f"\n{i}. {article['title']}")
        print(f"   Summary: {article['summary']}")
        print(f"   Category: {article['category']}")
        print(f"   Hashtags: {', '.join(article['hashtags'])}")
        print(f"   URL: {article['url']}")
    
    if len(result["articles"]) > 3:
        print(f"\n... and {len(result['articles']) - 3} more articles")
    
    print("\n" + "=" * 50)
    print("Full JSON output:")
    print("=" * 50)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()