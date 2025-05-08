#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p public/images

# Download placeholder images
curl -o public/images/hero-bg.jpg "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80"
curl -o public/images/private-dinner.jpg "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
curl -o public/images/cocktail-hour.jpg "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
curl -o public/images/meal-plan.jpg "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 