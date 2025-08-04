import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: 'problems',
          name: 'problems',
          component: () => import('../views/ProblemsView.vue'),
        },
        {
          path: 'problems/:id',
          name: 'problem-detail',
          component: () => import('../views/ProblemDetailView.vue'),
        },
        {
          path: 'contests',
          name: 'contests',
          component: () => import('../views/ContestsView.vue'),
        },
        {
          path: 'contests/:id',
          name: 'contest-detail',
          component: () => import('../views/ContestDetailView.vue'),
        },
        {
          path: 'submissions',
          name: 'submissions',
          component: () => import('../views/SubmissionsView.vue'),
        },
        {
          path: 'ranking',
          name: 'ranking',
          component: () => import('../views/RankingView.vue'),
        },
        {
          path: 'discuss',
          name: 'discuss',
          component: () => import('../views/DiscussView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

export default router
