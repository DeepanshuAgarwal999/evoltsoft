<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo/Brand -->
      <div class="navbar-brand">
        <RouterLink to="/" class="brand-link">
          <div class="brand-icon">⚡</div>
          <span class="brand-text">EvoltSoft</span>
        </RouterLink>
      </div>

      <!-- Mobile menu button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <!-- Navigation Links -->
      <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
        <div class="navbar-nav">
          <RouterLink to="/" class="nav-link" @click="closeMobileMenu"> Home </RouterLink>

          <!-- Show Login/Signup if not authenticated -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/login" class="nav-link" @click="closeMobileMenu"> Login </RouterLink>
            <RouterLink to="/signup" class="nav-link" @click="closeMobileMenu"> Sign Up </RouterLink>
          </template>

          <!-- Show Logout if authenticated -->
          <template v-else>
            <button @click="handleLogout" class="nav-link logout-btn">Logout</button>
          </template>
        </div>

        <!-- Create Station Button - Only show if authenticated -->
        <div class="navbar-actions" v-if="isAuthenticated">
          <RouterLink to="/create-station" class="create-station-btn" @click="closeMobileMenu">
            <span class="btn-icon">+</span>
            Create Station
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import UserService from "@/services/user-service";

const router = useRouter();
const { isAuthenticated } = useAuth();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await UserService.logout();
    router.push("/");
    closeMobileMenu();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  left: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Brand/Logo */
.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.brand-link:hover {
  transform: translateY(-2px);
}

.brand-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.brand-text {
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
  width: 30px;
  height: 30px;
  justify-content: space-around;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Navigation Menu */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  font-weight: 600;
}

.nav-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::before,
.nav-link.router-link-active::before {
  width: 80%;
}

/* Create Station Button */
.navbar-actions {
  display: flex;
  align-items: center;
}

.create-station-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  border: 2px solid transparent;
}

.create-station-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff5252, #d63031);
}

.create-station-btn:active {
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 1rem;
    transform: translateY(-100vh);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .navbar-nav {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .nav-link {
    padding: 1rem;
    text-align: center;
    width: 100%;
    border-radius: 12px;
    font-size: 1.1rem;
  }

  .navbar-actions {
    width: 100%;
    margin-top: 1rem;
  }

  .create-station-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }

  .navbar-container {
    padding: 0 1rem;
  }
}

/* Tablet Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .navbar-nav {
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 0.95rem;
  }

  .create-station-btn {
    padding: 0.7rem 1.3rem;
    font-size: 0.9rem;
  }
}

/* Animation for route transitions */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 8px;
}

.nav-link:hover::after {
  opacity: 1;
}

/* Logout button styles */
.logout-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color:white
}

.logout-btn:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}
</style>
