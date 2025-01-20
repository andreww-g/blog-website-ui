<template>
  <div class="contact-container">
    <h1>Contact Us</h1>

    <div class="contact-content">
      <div class="contact-section">
        <h2>Get in Touch</h2>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div class="contact-info">
          <div class="info-item">
            <i class="pi pi-envelope"></i>
            <span>blog@site.com</span>
          </div>
        </div>
      </div>

      <div class="social-section">
        <h2>Follow Us</h2>
        <div class="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-twitter"></i>
            <span>Twitter</span>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-facebook"></i>
            <span>Facebook</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-linkedin"></i>
            <span>LinkedIn</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i class="pi pi-instagram"></i>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #6a0dad;
  text-align: center;
  margin-bottom: 2rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-section, .social-section {
  padding: 1rem;
}

h2 {
  color: #6a0dad;
  margin-bottom: 1rem;
}

.contact-info {
  margin-top: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item i {
  color: #6a0dad;
  font-size: 1.5rem;
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.social-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #333;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background-color: #f0e6f5;
  color: #6a0dad;
  transform: translateY(-2px);
}

.social-links i {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .social-links {
    grid-template-columns: 1fr;
  }
}
</style>
