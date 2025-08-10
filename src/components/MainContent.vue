<template>
  <div class="h-full flex flex-col overflow-y-auto main-content-container">
    <!-- AI Chat -->
    <div v-if="selectedMenu === 'AI'" class="h-full">
      <AIChatComponent />
    </div>

    <!-- Academic Years -->
    <div v-else-if="selectedMenu === 'AcademicYears'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="calendar" size="md" class="text-blue-500 mb-2 sm:mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Academic Years</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your school's academic calendar and year settings</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="calendar" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Academic Years Management</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">This powerful feature is coming soon! You'll be able to create, manage, and organize academic years with ease.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">🚀</span>
                Under Development
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enrollments -->
    <div v-else-if="selectedMenu === 'Enrollments'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="users" size="lg" class="text-green-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Enrollments</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Configure and manage student enrollment windows</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-green-200/50 dark:border-green-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="users" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Enrollment Management</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Define enrollment periods, set capacity limits, and manage student registration workflows with smart automation.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">⏰</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Students Management -->
    <div v-else-if="selectedMenu === 'Students'" class="h-full">
      <StudentsComponent />
    </div>

    <!-- Parents Management -->
    <div v-else-if="selectedMenu === 'Parents'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="users" size="lg" class="text-orange-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Parents Management</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Connect with families and manage parent communication</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-orange-200/50 dark:border-orange-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="users" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Family Communication Hub</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Build stronger connections with families through comprehensive parent management tools, communication channels, and engagement tracking.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">👨‍👩‍👧‍👦</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Management -->
    <div v-else-if="selectedMenu === 'Staff'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="users" size="lg" class="text-indigo-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Staff Management</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your teaching team and administrative staff</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-indigo-200/50 dark:border-indigo-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="users" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Team Excellence Hub</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Empower your educational team with staff management tools, performance tracking, and professional development resources.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">👨‍🏫</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Programs Management -->
    <div v-else-if="selectedMenu === 'AllPrograms'" class="h-full">
      <ProgramsComponent />
    </div>

    <!-- Teacher Assignments -->
    <div v-else-if="selectedMenu === 'TeacherAssignments'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="user" size="lg" class="text-purple-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Teacher Assignments</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage teacher assignments and class allocations</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-purple-200/50 dark:border-purple-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="user" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Teacher Assignment Management</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Assign teachers to classes, manage teaching schedules, and optimize class allocations with intelligent assignment tools.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">👩‍🏫</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Program Courses Management -->
    <div v-else-if="selectedMenu === 'ProgramCourses'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="book" size="lg" class="text-cyan-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">Program Courses</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Organize courses within your educational programs</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-800 dark:to-cyan-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-cyan-200/50 dark:border-cyan-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="book" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Curriculum Designer</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Design structured learning paths by organizing courses within programs, creating cohesive educational experiences for your students.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">📚</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Management -->
    <div v-else-if="selectedMenu === 'Attendance'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="calendar" size="lg" class="text-orange-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Attendance</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track and manage student attendance for your classes</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-orange-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-orange-200/50 dark:border-orange-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="calendar" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Attendance Tracker</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Efficiently track student attendance with digital roll calls, automated reports, and attendance analytics for better insights.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">📋</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Courses Management -->
    <div v-else-if="selectedMenu === 'AllCourses'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="book" size="lg" class="text-rose-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">All Courses</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Browse and manage your complete course catalog</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-800 dark:to-rose-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-rose-200/50 dark:border-rose-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="book" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Course Library</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Explore your comprehensive course collection with advanced search, filtering, and management capabilities for your entire curriculum.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">📖</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Categories -->
    <div v-else-if="selectedMenu === 'CourseCategories'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="graduation" size="lg" class="text-violet-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">Course Categories</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Organize courses by subject areas and learning domains</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-800 dark:to-violet-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-violet-200/50 dark:border-violet-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="graduation" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Subject Organization</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Create meaningful course categories to help students and staff navigate your curriculum with intuitive subject-based organization.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">🏷️</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Enrollments -->
    <div v-else-if="selectedMenu === 'CourseEnrollments'" class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="users" size="lg" class="text-amber-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Course Enrollments</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track and manage student course registrations</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-amber-200/50 dark:border-amber-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="users" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Enrollment Dashboard</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Monitor student enrollments, track course capacity, and manage registration workflows with comprehensive enrollment analytics.</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">📋</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile -->
    <div v-else-if="selectedMenu === 'Profile'" class="flex-1 overflow-y-auto">
      <ProfileComponent :profile-data="getUserProfile()" />
    </div>

    <!-- Role Permissions -->
    <div v-else-if="selectedMenu === 'RolePermissions'" class="flex-1 overflow-y-auto">
      <RolePermissionComponent />
    </div>

    <!-- AI Settings -->
    <div v-else-if="selectedMenu === 'AISettings'" class="flex-1 overflow-y-auto">
      <AISettingsComponent />
    </div>

    <!-- Settings -->
    <div v-else-if="selectedMenu === 'Settings'" class="flex-1 overflow-y-auto">
      <div class="p-3 sm:p-6 min-h-full">
        <SettingsComponent />
      </div>
    </div>

    <!-- Individual Class View -->
    <div v-else-if="selectedMenu.startsWith('my-class/')" class="h-full">
      <ClassComponent :selected-menu="selectedMenu" />
    </div>

    <!-- Default/Fallback -->
    <div v-else class="flex-1 content-section overflow-y-auto">
      <div class="p-3 sm:p-6">
        <div class="max-w-6xl mx-auto">
          <div class="page-header mb-4 sm:mb-8">
            <HandDrawnIcon name="home" size="lg" class="text-gray-500 mb-4" />
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent mb-2">{{ selectedMenu }}</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Explore this section of your educational platform</p>
          </div>
          <div class="enhanced-card bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-900/10 rounded-lg sm:rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 icon-pulse">
                <HandDrawnIcon name="home" size="lg" class="text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ selectedMenu }} Hub</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">This section is being prepared with amazing features to enhance your educational experience. Stay tuned for updates!</p>
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                <span class="animate-pulse">🔧</span>
                In Development
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AIChatComponent from './AIChatComponent.vue'
import StudentsComponent from './StudentsComponent.vue'
import ProgramsComponent from './ProgramsComponent.vue'
import ProfileComponent from './ProfileComponent.vue'
import RolePermissionComponent from './RolePermissionComponent.vue'
import AISettingsComponent from './AISettingsComponent.vue'
import SettingsComponent from './SettingsComponent.vue'
import ClassComponent from './ClassComponent.vue'
import HandDrawnIcon from './HandDrawnIcon.vue'

const props = defineProps({
  selectedMenu: String,
  sidebarCollapsed: Boolean
})

// Get user profile data from localStorage
const getUserProfile = () => {
  const savedUser = localStorage.getItem('algo_user')
  if (savedUser) {
    return JSON.parse(savedUser)
  }
  return null
}
</script>

<style scoped>
/* Main content enhancements */
.main-content-container {
  animation: contentFadeIn 0.6s ease-out;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content sections */
.content-section {
  animation: sectionSlideIn 0.7s ease-out;
}

@keyframes sectionSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Page headers */
.page-header {
  animation: headerGlow 0.8s ease-out;
}

@keyframes headerGlow {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced cards */
.enhanced-card {
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardAppear 0.9s ease-out;
}

.enhanced-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 20px rgba(59, 130, 246, 0.15);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Icon pulse animation */
.icon-pulse {
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
}

/* Gradient text animations */
.page-header h1 {
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

/* Breathing animation for status badges */
.enhanced-card .animate-pulse {
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Subtle hover effects for interactive elements */
.enhanced-card .inline-flex {
  transition: all 0.2s ease;
}

.enhanced-card:hover .inline-flex {
  transform: scale(1.05);
}

/* Dark mode enhancements */
.dark .enhanced-card {
  background: linear-gradient(135deg, 
    rgba(31, 41, 55, 0.8) 0%, 
    rgba(55, 65, 81, 0.6) 100%);
  border-color: rgba(59, 130, 246, 0.2);
}

.dark .enhanced-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(59, 130, 246, 0.2);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .enhanced-card {
    padding: 1rem;
    margin: 0 0.5rem;
  }
  
  .page-header {
    padding: 0 0.5rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
    line-height: 1.2;
  }
  
  .enhanced-card:hover {
    transform: translateY(-1px) scale(1.005);
  }
  
  .icon-pulse {
    width: 3rem;
    height: 3rem;
  }
}

@media (max-width: 768px) {
  .enhanced-card {
    padding: 1.25rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .enhanced-card:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

@media (min-width: 1024px) {
  .enhanced-card {
    padding: 2.5rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
}

/* Performance optimization */
.enhanced-card,
.content-section,
.main-content-container {
  will-change: transform, opacity;
}
</style>