<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const features = [
  {
    icon: 'pi pi-pencil',
    title: 'Easy Content Creation',
    description: 'Write and publish articles with our intuitive editor'
  },
  {
    icon: 'pi pi-users',
    title: 'Publisher Profile',
    description: 'Create your professional profile and build your audience'
  },
  {
    icon: 'pi pi-share-alt',
    title: 'Social Integration',
    description: 'Connect your social media accounts and expand your reach'
  }
];

const handleStartJourney = () => {
  if (authStore.isAuthorized) {
    navigateTo('/articles-preview');
  } else {
    navigateTo('/auth');
  }
};
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Develop your own blog in 2 minutes</h1>
        <p class="hero-subtitle">We offer various tools for that</p>
        <Button
          label="Start Journey"
          class="start-button"
          @click="handleStartJourney"
        />
      </div>
      <div class="hero-image">
        <!-- Inline SVG illustration -->
        <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Laptop base -->
          <rect x="100" y="150" width="200" height="120" rx="10" fill="#f0f0f0"/>
          <!-- Laptop screen -->
          <rect x="110" y="70" width="180" height="120" rx="5" fill="white"/>
          <!-- Screen content lines -->
          <rect x="120" y="90" width="160" height="10" rx="2" fill="#e0e0e0"/>
          <rect x="120" y="110" width="140" height="10" rx="2" fill="#e0e0e0"/>
          <rect x="120" y="130" width="120" height="10" rx="2" fill="#e0e0e0"/>
          <!-- Decorative elements -->
          <circle cx="320" cy="100" r="30" fill="#6a0dad" opacity="0.2"/>
          <circle cx="80" cy="200" r="40" fill="#9b4dca" opacity="0.2"/>
          <!-- Floating elements -->
          <rect x="290" y="150" width="40" height="40" rx="5" fill="#6a0dad" opacity="0.3"/>
          <rect x="70" y="120" width="30" height="30" rx="5" fill="#9b4dca" opacity="0.3"/>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="features-title">Why Choose Our Platform?</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <i :class="feature.icon"></i>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <div class="cta-content">
        <h2>Ready to Start Your Blog?</h2>
        <p>Join our community of writers and share your stories with the world</p>
        <Button
          label="Get Started Now"
          class="cta-button"
          @click="handleStartJourney"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 8rem;
  background: linear-gradient(135deg, #6a0dad, #9b4dca);
  color: white;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero-image svg {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.start-button {
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  background-color: white;
  color: #6a0dad;
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.start-button:hover {
  transform: translateY(-2px);
  background-color: #f0f0f0;
}

.features {
  padding: 6rem 2rem;
  background-color: #f8f9fa;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2.5rem;
  color: #6a0dad;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.cta {
  background: linear-gradient(135deg, #9b4dca, #6a0dad);
  padding: 6rem 2rem;
  text-align: center;
  color: white;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  background-color: white;
  color: #6a0dad;
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  background-color: #f0f0f0;
}

@media (max-width: 1024px) {
  .hero {
    padding: 4rem 2rem;
    flex-direction: column;
    text-align: center;
  }

  .hero-content {
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .cta h2 {
    font-size: 2rem;
  }
}

/* Add animation for floating elements */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.hero-image svg rect:nth-last-child(-n+2) {
  animation: float 3s ease-in-out infinite;
}
</style>
