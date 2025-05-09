#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p public/images

# Download new images
# 1. Hero image for desktop - private event on the water
curl -o public/images/hero-bg.jpg "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80"

# 2. Desktop image - two young chef ladies
curl -o public/images/chefs-back-to-back.jpg "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1920&q=80"

# 3. Mobile image - first chef
curl -o public/images/angie.jpg "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"

# 4. Mobile image - second chef
curl -o public/images/iris.jpg "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=800&q=80"

# Additional images for other sections
curl -o public/images/private-dinner.jpg "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
curl -o public/images/cocktail-hour.jpg "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80"
curl -o public/images/meal-plan.jpg "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 