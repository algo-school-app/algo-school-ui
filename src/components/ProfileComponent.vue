<template>
  <div class="h-full w-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-y-auto">
    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-300">Loading profile information...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center max-w-md mx-auto">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <i class="fas fa-exclamation-triangle text-2xl text-red-500 dark:text-red-400"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Profile</h3>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">{{ error }}</p>
        <button @click="retryLoad" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
          <i class="fas fa-refresh"></i> Retry
        </button>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="currentProfileData" class="flex-1 flex flex-col overflow-y-auto">
      <!-- Profile Header -->
      <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4 lg:py-6">
        <div class="flex items-start gap-3 sm:gap-4 lg:gap-6">
          <div class="flex-shrink-0">
            <div class="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <i class="fas fa-user-circle text-xl sm:text-2xl lg:text-3xl text-blue-500 dark:text-blue-400"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">{{ currentProfileData.user_profile?.full_name || currentProfileData.name }}</h2>
            <p class="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{{ currentProfileData.user_profile?.email || currentProfileData.email }}</p>
            <p v-if="primaryRole" class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
              <i class="fas fa-user-tag text-blue-500 text-xs sm:text-sm"></i> {{ primaryRole }}
            </p>
            <p v-if="currentProfileData.user_profile?.phone_number" class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
              <i class="fas fa-phone text-blue-500 text-xs sm:text-sm"></i> {{ currentProfileData.user_profile.phone_number }}
            </p>
            <div class="flex flex-wrap gap-1 sm:gap-2">
              <span v-if="currentProfileData.current_tenant" class="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                <i class="fas fa-building text-blue-500 text-xs"></i>
                <span class="hidden sm:inline">{{ currentProfileData.current_tenant.display_name }}</span>
                <span class="sm:hidden">{{ currentProfileData.current_tenant.display_name.substring(0, 10) }}{{ currentProfileData.current_tenant.display_name.length > 10 ? '...' : '' }}</span>
              </span>
              <span v-if="currentProfileData.total_permissions" class="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                <i class="fas fa-shield-alt text-blue-500 text-xs"></i>
                <span class="hidden sm:inline">{{ currentProfileData.total_permissions }} Permission{{ currentProfileData.total_permissions !== 1 ? 's' : '' }}</span>
                <span class="sm:hidden">{{ currentProfileData.total_permissions }}P</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6">
        <div class="flex space-x-1 overflow-x-auto">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === tab.id 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i :class="tab.icon" class="text-sm sm:text-base"></i>
            <span class="hidden sm:inline">{{ tab.label }}</span><span class="sm:hidden">{{ tab.label.split(' ')[0] }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 min-h-0">
        <!-- Personal Information Tab -->
        <div v-if="activeTab === 'personal'" class="h-full overflow-auto p-3 sm:p-6">
          <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2">
                  <i class="fas fa-user text-blue-500"></i> Personal Information
                </h3>
              </div>
              <div class="p-4 sm:p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div class="space-y-1">
                    <label class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <p class="text-sm sm:text-base text-gray-900 dark:text-white">{{ currentProfileData.user_profile?.full_name || currentProfileData.name }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p class="text-sm sm:text-base text-gray-900 dark:text-white">{{ currentProfileData.user_profile?.email || currentProfileData.email }}</p>
                  </div>
                  <div v-if="currentProfileData.user_profile?.phone_number" class="space-y-1">
                    <label class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                    <p class="text-sm sm:text-base text-gray-900 dark:text-white">{{ currentProfileData.user_profile.phone_number }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Person ID</label>
                    <p class="text-xs sm:text-sm text-gray-900 dark:text-white font-mono">{{ currentProfileData.user_profile?.person_id || currentProfileData.id }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Auth User ID</label>
                    <p class="text-xs sm:text-sm text-gray-900 dark:text-white font-mono">{{ authUserId }}</p>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button @click="editProfile" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 sm:gap-2 justify-center">
                    <i class="fas fa-edit"></i> Edit Profile
                  </button>
                  <button @click="changePassword" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 sm:gap-2 justify-center">
                    <i class="fas fa-key"></i> Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- School & Role Tab -->
        <div v-if="activeTab === 'schools'" class="h-full overflow-auto p-3 sm:p-6">
          <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ currentProfileData.current_tenant?.display_name || 'School Information' }}</h3>
              </div>
              <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div v-if="currentProfileData.current_tenant?.description">
                  <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300">{{ currentProfileData.current_tenant.description }}</p>
                </div>
                
                <div>
                  <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <i class="fas fa-user-tag text-blue-500"></i> Role
                  </h4>
                  <div class="flex flex-wrap gap-1 sm:gap-2">
                    <span v-for="role in currentProfileData.roles || [{ display_name: currentProfileData.role, description: 'User role' }]" :key="role.name || role.display_name" class="inline-flex flex-col px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
                      <span class="font-medium text-xs sm:text-sm">{{ role.display_name }}</span>
                      <small class="text-blue-600 dark:text-blue-300 text-xs hidden sm:inline">{{ role.description }}</small>
                    </span>
                  </div>
                </div>

                <div v-if="currentProfileData.permissions && currentProfileData.permissions.length > 0">
                  <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <i class="fas fa-shield-alt text-blue-500"></i> Key Permissions
                  </h4>
                  <div class="flex flex-wrap gap-1 sm:gap-2">
                    <span v-for="permission in currentProfileData.permissions.slice(0, 6)" :key="permission.id" class="inline-flex flex-col px-2 sm:px-3 py-1.5 sm:py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                      <span class="font-medium text-xs sm:text-sm">{{ permission.display_name }}</span>
                      <small class="text-green-600 dark:text-green-300 text-xs hidden sm:inline">{{ permission.description }}</small>
                    </span>
                    <button v-if="currentProfileData.permissions.length > 6" @click="activeTab = 'permissions'" class="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <span class="font-medium text-xs sm:text-sm">+{{ currentProfileData.permissions.length - 6 }} more</span>
                    </button>
                  </div>
                </div>
                <div v-else>
                  <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <i class="fas fa-shield-alt text-blue-500"></i> Permissions
                  </h4>
                  <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">No permissions data available. Check the "All Permissions" tab for detailed view.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All Permissions Tab -->
        <div v-if="activeTab === 'permissions'" class="h-full flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2">
                <i class="fas fa-shield-alt text-blue-500"></i> All Permissions ({{ currentProfileData.permissions?.length || currentProfileData.total_permissions || 0 }})
              </h3>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div class="flex-1 relative">
              <i class="fas fa-search absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm"></i>
              <input 
                v-model="permissionSearch" 
                type="text" 
                placeholder="Search permissions..."
                class="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            <select v-model="permissionResourceFilter" class="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Resources</option>
              <option v-for="resource in uniqueResources" :key="resource" :value="resource">
                {{ resource }}
              </option>
            </select>
            <select v-model="permissionStatusFilter" class="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <!-- Permissions Table -->
          <div class="flex-1 overflow-auto">
            <table class="min-w-full bg-white dark:bg-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th @click="sortPermissions('display_name')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      <span class="hidden sm:inline">Permission Name</span><span class="sm:hidden">Name</span>
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('display_name')"></i>
                    </div>
                  </th>
                  <th @click="sortPermissions('resource')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Resource
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('resource')"></i>
                    </div>
                  </th>
                  <th @click="sortPermissions('action')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Action
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('action')"></i>
                    </div>
                  </th>
                  <th class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th @click="sortPermissions('is_active')" class="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div class="flex items-center gap-2">
                      Status
                      <i class="fas fa-sort text-gray-400" :class="getSortIcon('is_active')"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="permission in filteredPermissions" :key="permission.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{{ permission.display_name }}</div>
                    <code class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded hidden sm:inline-block">{{ permission.name }}</code>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {{ permission.resource }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {{ permission.action }}
                    </span>
                  </td>
                  <td class="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                    <div class="text-xs sm:text-sm text-gray-900 dark:text-white max-w-xs truncate">{{ permission.description || 'No description' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      permission.is_active 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    ]">
                      {{ permission.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closePasswordModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-md" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
          <button @click="closePasswordModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="submitPasswordChange" class="space-y-4">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <input v-model="passwordForm.currentPassword" type="password" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input v-model="passwordForm.newPassword" type="password" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <div v-if="passwordForm.newPassword" class="mt-2 text-xs sm:text-sm">
                <div class="flex items-center gap-2 mb-1">
                  <div :class="['w-2 h-2 rounded-full', passwordStrength.length ? 'bg-green-500' : 'bg-gray-300']"></div>
                  <span :class="passwordStrength.length ? 'text-green-600' : 'text-gray-500'" class="text-xs sm:text-sm">At least 8 characters</span>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <div :class="['w-2 h-2 rounded-full', passwordStrength.hasNumber ? 'bg-green-500' : 'bg-gray-300']"></div>
                  <span :class="passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'" class="text-xs sm:text-sm">Contains number</span>
                </div>
                <div class="flex items-center gap-2 mb-1">
                  <div :class="['w-2 h-2 rounded-full', passwordStrength.hasSpecial ? 'bg-green-500' : 'bg-gray-300']"></div>
                  <span :class="passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-500'" class="text-xs sm:text-sm">Contains special character</span>
                </div>
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', passwordStrength.hasUpper ? 'bg-green-500' : 'bg-gray-300']"></div>
                  <span :class="passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'" class="text-xs sm:text-sm">Contains uppercase letter</span>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
              <input v-model="passwordForm.confirmPassword" type="password" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <div v-if="passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" class="mt-1 text-xs sm:text-sm text-red-600">
                Passwords do not match
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-4">
              <button type="button" @click="closePasswordModal" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button type="submit" :disabled="!isPasswordValid" :class="[
                'px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition-colors',
                isPasswordValid 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              ]">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeEditModal">
      <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl" @click.stop>
        <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
          <button @click="closeEditModal" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-4 sm:p-6">
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input v-model="editForm.name" type="text" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input v-model="editForm.email" type="email" required class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input v-model="editForm.phone" type="tel" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <textarea v-model="editForm.bio" rows="3" class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-4">
              <button type="button" @click="closeEditModal" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button type="submit" class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '../services/supabase.js'
import { UserService } from '../services/userService.js'

const props = defineProps({
  profileData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

// Local state
const activeTab = ref('personal')
const authUserId = ref('')

// Table functionality for permissions
const permissionSearch = ref('')
const permissionResourceFilter = ref('')
const permissionStatusFilter = ref('')
const permissionSortField = ref('display_name')
const permissionSortDirection = ref('asc')

// Password change functionality
const showPasswordModal = ref(false)
const passwordLoading = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Edit profile functionality
const showEditModal = ref(false)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
  { id: 'schools', label: 'School & Role', icon: 'fas fa-building' },
  { id: 'permissions', label: 'All Permissions', icon: 'fas fa-shield-alt' }
]

// Force reactivity by creating a trigger
const profileDataTrigger = ref(0)

// Get current profile data with fallback to demo data
const currentProfileData = computed(() => {
  // Access the trigger to make this reactive
  profileDataTrigger.value
  
  // Always prioritize stored profile data over props if it exists and has permissions
  const storedProfile = UserService.getStoredProfile()
  if (storedProfile && storedProfile.permissions) {
    return storedProfile
  }
  
  // Only use props if we don't have stored profile with permissions
  if (props.profileData) {
    return props.profileData
  }
  
  // Fallback to stored profile even without permissions
  if (storedProfile) {
    return storedProfile
  }
  
  // No fallback data - only use real data from API
  
  return null
})

const generateMockPermissions = () => {
  return [
    { id: 1, name: 'ai_chat_access', display_name: 'AI Chat Access', resource: 'ai', action: 'use', description: 'Access to AI chat functionality', is_active: true },
    { id: 2, name: 'profile_view', display_name: 'View Profile', resource: 'profile', action: 'read', description: 'View own profile information', is_active: true },
    { id: 3, name: 'profile_edit', display_name: 'Edit Profile', resource: 'profile', action: 'update', description: 'Edit own profile information', is_active: true },
    { id: 4, name: 'dashboard_access', display_name: 'Dashboard Access', resource: 'dashboard', action: 'read', description: 'Access to main dashboard', is_active: true },
    { id: 5, name: 'students_view', display_name: 'View Students', resource: 'students', action: 'read', description: 'View student information', is_active: true },
    { id: 6, name: 'programs_view', display_name: 'View Programs', resource: 'programs', action: 'read', description: 'View academic programs', is_active: true },
    { id: 7, name: 'notifications_receive', display_name: 'Receive Notifications', resource: 'notifications', action: 'receive', description: 'Receive system notifications', is_active: true },
    { id: 8, name: 'file_upload', display_name: 'Upload Files', resource: 'files', action: 'create', description: 'Upload files to the system', is_active: true },
    { id: 9, name: 'reports_basic', display_name: 'Basic Reports', resource: 'reports', action: 'read', description: 'Access to basic reporting features', is_active: true },
    { id: 10, name: 'settings_personal', display_name: 'Personal Settings', resource: 'settings', action: 'update', description: 'Modify personal settings', is_active: true },
    { id: 11, name: 'calendar_view', display_name: 'View Calendar', resource: 'calendar', action: 'read', description: 'Access calendar functionality', is_active: true },
    { id: 12, name: 'messages_send', display_name: 'Send Messages', resource: 'messages', action: 'create', description: 'Send messages to other users', is_active: true },
    { id: 13, name: 'help_access', display_name: 'Access Help', resource: 'help', action: 'read', description: 'Access help and support resources', is_active: true },
    { id: 14, name: 'feedback_submit', display_name: 'Submit Feedback', resource: 'feedback', action: 'create', description: 'Submit feedback and suggestions', is_active: true },
    { id: 15, name: 'export_data', display_name: 'Export Data', resource: 'data', action: 'export', description: 'Export personal data', is_active: false }
  ]
}

// Computed properties for permissions table
const uniqueResources = computed(() => {
  if (!currentProfileData.value?.permissions) return []
  return [...new Set(currentProfileData.value.permissions.map(p => p.resource))].sort()
})

const filteredPermissions = computed(() => {
  // Check if we have permissions data
  const permissions = currentProfileData.value?.permissions
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return []
  }

  let filtered = permissions

  // Search filter
  if (permissionSearch.value) {
    const search = permissionSearch.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.display_name.toLowerCase().includes(search) ||
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    )
  }

  // Resource filter
  if (permissionResourceFilter.value) {
    filtered = filtered.filter(p => p.resource === permissionResourceFilter.value)
  }

  // Status filter
  if (permissionStatusFilter.value !== '') {
    const isActive = permissionStatusFilter.value === 'true'
    filtered = filtered.filter(p => p.is_active === isActive)
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal = a[permissionSortField.value]
    let bVal = b[permissionSortField.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (permissionSortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const primaryRole = computed(() => {
  if (!currentProfileData.value?.roles || currentProfileData.value.roles.length === 0) {
    return currentProfileData.value?.role || null
  }
  return currentProfileData.value.roles[0].display_name
})

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword
  return {
    length: password.length >= 8,
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    hasUpper: /[A-Z]/.test(password)
  }
})

const isPasswordValid = computed(() => {
  const newPassword = passwordForm.value.newPassword
  const confirmPassword = passwordForm.value.confirmPassword
  
  return newPassword.length >= 8 &&
         /[A-Z]/.test(newPassword) &&
         /[a-z]/.test(newPassword) &&
         /[0-9]/.test(newPassword) &&
         /[^A-Za-z0-9]/.test(newPassword) &&
         newPassword === confirmPassword &&
         passwordForm.value.currentPassword
})

onMounted(async () => {
  await setAuthUserId()
  // Trigger initial reactivity
  profileDataTrigger.value++
})

// Watch for profile data changes to update auth user ID
watch(() => currentProfileData.value, () => {
  setAuthUserId()
}, { immediate: false })

const setAuthUserId = async () => {
  // Get the actual Supabase auth user ID (different from person_id)
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      authUserId.value = user.id
    } else {
      authUserId.value = 'Not available'
    }
  } catch (authError) {
    console.warn('Could not get auth user ID:', authError)
    authUserId.value = 'Not available'
  }
}

const retryLoad = async () => {
  try {
    await UserService.loadUserProfile()
    setAuthUserId()
    // Trigger reactivity update
    profileDataTrigger.value++
    showToast('Profile data refreshed successfully!', 'success')
  } catch (error) {
    console.error('ProfileComponent: Failed to reload profile:', error)
    showToast('Failed to refresh profile data', 'error')
  }
}

const sortPermissions = (field) => {
  if (permissionSortField.value === field) {
    permissionSortDirection.value = permissionSortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    permissionSortField.value = field
    permissionSortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (permissionSortField.value !== field) {
    return 'fas fa-sort'
  }
  return permissionSortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}

const editProfile = () => {
  const profile = currentProfileData.value
  if (profile) {
    editForm.value = {
      name: profile.user_profile?.full_name || profile.name,
      email: profile.user_profile?.email || profile.email,
      phone: profile.user_profile?.phone_number || '',
      bio: profile.bio || ''
    }
  }
  showEditModal.value = true
}

const saveProfile = () => {
  console.log('Saving profile:', editForm.value)
  
  // Update local storage for demo
  const savedUser = localStorage.getItem('algo_user')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    const updatedUser = {
      ...user,
      name: editForm.value.name,
      email: editForm.value.email,
      phone: editForm.value.phone,
      bio: editForm.value.bio
    }
    localStorage.setItem('algo_user', JSON.stringify(updatedUser))
  }
  
  closeEditModal()
  showToast('Profile updated successfully!', 'success')
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    email: '',
    phone: '',
    bio: ''
  }
}

const changePassword = () => {
  showPasswordModal.value = true
  resetPasswordForm()
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  resetPasswordForm()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const submitPasswordChange = async () => {
  passwordLoading.value = true
  
  try {
    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword
    })
    
    if (error) {
      throw error
    }
    
    showToast('Password updated successfully!', 'success')
    closePasswordModal()
    
  } catch (error) {
    console.error('Error updating password:', error)
    showToast(error.message || 'Failed to update password. Please try again.', 'error')
  } finally {
    passwordLoading.value = false
  }
}

const showToast = (message, type = 'info') => {
  if (window.showToast) {
    window.showToast(type, 'Profile', message)
  } else {
    alert(message)
  }
}
</script>