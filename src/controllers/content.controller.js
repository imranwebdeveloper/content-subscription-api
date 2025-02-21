const axios = require("axios");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const User = require("../models/user.model");

exports.getPersonalizedContent = async (req, res) => {
  try {
    const user = req.user;
    const existingUser = await User.findById(user.userId).lean();

    if (
      !existingUser ||
      !existingUser.subscribedCategories ||
      existingUser.subscribedCategories.length === 0
    ) {
      return res.status(400).json({
        message: "You have no subscribed categories.",
        success: false,
      });
    }

    let newsSources = [];

    for (const category of existingUser.subscribedCategories) {
      try {
        const response = await newsapi.v2.sources({
          category: category.toLowerCase(),
          language: "en",
          country: "us",
        });

        if (response.sources && response.sources.length > 0) {
          const filteredSources = response.sources.map((source) => ({
            id: source.id,
            name: source.name,
            description: source.description,
            url: source.url,
            category: source.category,
          }));
          newsSources = [...newsSources, ...filteredSources];
        }
      } catch (apiError) {
        console.error(
          `Error fetching sources for category: ${category}`,
          apiError
        );
      }
    }

    res.json({
      message: "Sources fetched successfully",
      success: true,
      data: newsSources,
    });
  } catch (error) {
    console.error("Error fetching sources:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
exports.getRecommendedContent = async (req, res) => {
  try {
    let recommendedArticles = [];
    const response = await newsapi.v2.everything({
      q: "bitcoin",
      language: "en",
      sortBy: "relevancy",
      page: 2,
    });

    if (
      response.status === "ok" &&
      response.articles &&
      response.articles.length > 0
    ) {
      recommendedArticles = response.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }));

      res.json({
        message: "Recommended content fetched successfully",
        success: true,
        data: recommendedArticles,
      });
    } else {
      res
        .status(404)
        .json({ message: "No recommended content found.", success: false });
    }
  } catch (error) {
    console.error("Error fetching recommended content:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
