<template>
  <div 
    :class="[
      'inline-flex items-center justify-center hand-drawn-icon',
      sizeClass,
      colorClass
    ]"
    :style="customStyle"
  >
    <svg
      :width="actualSize"
      :height="actualSize"
      :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="hand-drawn-svg"
    >
      <!-- Students Icon (Person with Graduation Cap) -->
      <g v-if="name === 'students'" class="hand-drawn-path">
        <!-- Person's head -->
        <circle
          cx="12"
          cy="8"
          r="3"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Graduation cap base -->
        <ellipse
          cx="12"
          cy="6"
          rx="4"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Cap top (mortar board) -->
        <rect
          x="8"
          y="4"
          width="8"
          height="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Tassel -->
        <path
          d="M16 4.5l1 0.5l0 1"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Person's body -->
        <path
          d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Group Users Icon (Two People) -->
      <g v-else-if="name === 'group-users'" class="hand-drawn-path">
        <!-- First person (left) -->
        <circle
          cx="8"
          cy="7"
          r="2.5"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Second person (right) -->
        <circle
          cx="16"
          cy="7"
          r="2.5"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Bodies -->
        <path
          d="M4 20v-2a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2M14 20v-2a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Graduation Cap Icon -->
      <g v-else-if="name === 'graduation'" class="hand-drawn-path">
        <path
          d="M2 12l10-5 10 5-10 5-10-5z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M6 14v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="22"
          cy="12"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Book Icon -->
      <g v-else-if="name === 'book'" class="hand-drawn-path">
        <path
          d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-4H6c-1.1 0-2 .9-2 2z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M14 4v4h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M8 13h8M8 17h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Calendar Icon -->
      <g v-else-if="name === 'calendar'" class="hand-drawn-path">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          ry="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M16 2v4M8 2v4M3 10h18"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="8"
          cy="14"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <circle
          cx="12"
          cy="14"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <circle
          cx="16"
          cy="14"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
      </g>

      <!-- Settings/Gear Icon -->
      <g v-else-if="name === 'settings'" class="hand-drawn-path">
        <circle
          cx="12"
          cy="12"
          r="3"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Dashboard/Home Icon -->
      <g v-else-if="name === 'home'" class="hand-drawn-path">
        <path
          d="M3 9.5L12 2l9 7.5v11c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-11z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M9 22V12h6v10"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- AI/Robot Icon -->
      <g v-else-if="name === 'ai'" class="hand-drawn-path">
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx="2"
          ry="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="9"
          cy="10"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <circle
          cx="15"
          cy="10"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <path
          d="M9 14h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 6V4M12 20v-2M6 12H4M20 12h-2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Users/People Icon -->
      <g v-else-if="name === 'users'" class="hand-drawn-path">
        <path
          d="M16 14v6M8 14v6M8 14a6 6 0 1 1 8 0"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="12"
          cy="8"
          r="3"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M20 19v-1a4 4 0 0 0-4-4h-1M4 19v-1a4 4 0 0 1 4-4h1"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Robot/AI Icon -->
      <g v-else-if="name === 'robot'" class="hand-drawn-path">
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx="2"
          ry="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="9"
          cy="10"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <circle
          cx="15"
          cy="10"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <path
          d="M9 14h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 6V4M12 20v-2M6 12H4M20 12h-2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Cogs/Settings Multiple Icon -->
      <g v-else-if="name === 'cogs'" class="hand-drawn-path">
        <circle
          cx="8"
          cy="8"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="16"
          cy="16"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M10.5 8.5l3 3M6 8l-2 2M18 16l2 2M8 6l2-2M16 18l2 2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Academic Programs Icon -->
      <g v-else-if="name === 'programs'" class="hand-drawn-path">
        <path
          d="M2 12l10-5 10 5-10 5-10-5z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M6 14v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="22"
          cy="12"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Courses/Books Stack Icon -->
      <g v-else-if="name === 'courses'" class="hand-drawn-path">
        <rect
          x="2"
          y="6"
          width="18"
          height="12"
          rx="2"
          ry="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <rect
          x="4"
          y="4"
          width="16"
          height="2"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <rect
          x="6"
          y="2"
          width="12"
          height="2"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M8 12h8M8 15h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- User Profile Icon -->
      <g v-else-if="name === 'user'" class="hand-drawn-path">
        <circle
          cx="12"
          cy="8"
          r="4"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Shield/Security Icon -->
      <g v-else-if="name === 'shield'" class="hand-drawn-path">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M9 12l2 2 4-4"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Menu/Hamburger Icon -->
      <g v-else-if="name === 'menu'" class="hand-drawn-path">
        <path
          d="M3 12h18M3 6h18M3 18h18"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Theme/Palette Icon -->
      <g v-else-if="name === 'palette'" class="hand-drawn-path">
        <circle
          cx="12"
          cy="12"
          r="9"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 3c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2s2 .9 2 2zM3 12c1.1 0 2-.9 2-2s-.9-2-2-2c-1.1 0-2 .9-2 2s.9 2 2 2zM12 21c0-1.1-.9-2-2-2s-2 .9-2 2c0 1.1.9 2 2 2s2-.9 2-.9zM21 12c-1.1 0-2-.9-2-2s.9-2 2-2c1.1 0 2 .9 2 2s-.9 2-2 2z"
          :fill="currentColor"
          class="wobbly-dot"
        />
      </g>

      <!-- Sun Icon -->
      <g v-else-if="name === 'sun'" class="hand-drawn-path">
        <circle
          cx="12"
          cy="12"
          r="4"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Moon Icon -->
      <g v-else-if="name === 'moon'" class="hand-drawn-path">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="9"
          cy="8"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
        <circle
          cx="7"
          cy="12"
          r="0.5"
          :fill="currentColor"
          class="wobbly-dot"
        />
      </g>

      <!-- Eye Icon (View Action) -->
      <g v-else-if="name === 'eye'" class="hand-drawn-path">
        <path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <circle
          cx="12"
          cy="12"
          r="1"
          :fill="currentColor"
          class="wobbly-dot"
        />
      </g>

      <!-- Edit/Pencil Icon -->
      <g v-else-if="name === 'edit'" class="hand-drawn-path">
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Trash Icon (Delete Action) -->
      <g v-else-if="name === 'trash'" class="hand-drawn-path">
        <path
          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Left Arrow Icon (Back/Previous) -->
      <g v-else-if="name === 'arrow-left'" class="hand-drawn-path">
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Down Arrow Icon (Expand/Collapse) -->
      <g v-else-if="name === 'arrow-down'" class="hand-drawn-path">
        <path
          d="M6 9l6 6 6-6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Right Arrow Icon (Collapsed state) -->
      <g v-else-if="name === 'arrow-right'" class="hand-drawn-path">
        <path
          d="M9 18l6-6-6-6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Document Icon -->
      <g v-else-if="name === 'document'" class="hand-drawn-path">
        <path
          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M13 2v7h7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M8 13h8M8 17h6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- PDF Document Icon -->
      <g v-else-if="name === 'pdf'" class="hand-drawn-path">
        <path
          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M13 2v7h7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <text
          x="12"
          y="16"
          text-anchor="middle"
          :fill="currentColor"
          class="text-xs font-bold"
        >PDF</text>
      </g>

      <!-- DOC Document Icon -->
      <g v-else-if="name === 'doc'" class="hand-drawn-path">
        <path
          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M13 2v7h7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <text
          x="12"
          y="16"
          text-anchor="middle"
          :fill="currentColor"
          class="text-xs font-bold"
        >DOC</text>
      </g>

      <!-- TXT Document Icon -->
      <g v-else-if="name === 'txt'" class="hand-drawn-path">
        <path
          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M13 2v7h7"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <text
          x="12"
          y="16"
          text-anchor="middle"
          :fill="currentColor"
          class="text-xs font-bold"
        >TXT</text>
      </g>

      <!-- Upload Icon -->
      <g v-else-if="name === 'upload'" class="hand-drawn-path">
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M7 10l5-5 5 5"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 5v12"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Download Icon -->
      <g v-else-if="name === 'download'" class="hand-drawn-path">
        <path
          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M7 10l5 5 5-5"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 15V3"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Classroom/Chalkboard Icon -->
      <g v-else-if="name === 'classroom'" class="hand-drawn-path">
        <!-- Chalkboard -->
        <rect
          x="3"
          y="5"
          width="18"
          height="12"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Board frame -->
        <rect
          x="2"
          y="4"
          width="20"
          height="14"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Writing on board -->
        <path
          d="M6 9h8M6 12h12M6 15h6"
          :stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Stand legs -->
        <path
          d="M4 18v3M20 18v3"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Chalkboard Teacher Icon -->
      <g v-else-if="name === 'chalkboard-teacher'" class="hand-drawn-path">
        <!-- Chalkboard -->
        <rect
          x="4"
          y="5"
          width="16"
          height="10"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Board frame -->
        <rect
          x="3"
          y="4"
          width="18"
          height="12"
          rx="1"
          ry="1"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Writing on board -->
        <path
          d="M6 8h8M6 10h10M6 12h6"
          :stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Teacher figure -->
        <circle
          cx="12"
          cy="18"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Teacher body -->
        <path
          d="M12 20v2M10 21l2-1 2 1"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Close/X Icon -->
      <g v-else-if="name === 'close'" class="hand-drawn-path">
        <path
          d="M18 6L6 18M6 6l12 12"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Search Icon -->
      <g v-else-if="name === 'search'" class="hand-drawn-path">
        <circle
          cx="11"
          cy="11"
          r="8"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="m21 21-4.35-4.35"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Alert/Warning Icon -->
      <g v-else-if="name === 'alert'" class="hand-drawn-path">
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M12 9v4M12 17h0"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Parents Icon (Father and Mother) -->
      <g v-else-if="name === 'parents'" class="hand-drawn-path">
        <!-- Father (taller, left) -->
        <circle
          cx="8"
          cy="6"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Father's body (shoulders and torso) -->
        <path
          d="M5 12v8M11 12v8M5 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        
        <!-- Mother (shorter, right) -->
        <circle
          cx="16"
          cy="7"
          r="2"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Mother's body (shoulders and torso) -->
        <path
          d="M13 13v7M19 13v7M13 13a3 3 0 0 1 3-3 3 3 0 0 1 3 3"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        
        <!-- Optional: Mother's hair detail -->
        <path
          d="M14 5.5c0.5-0.5 1-0.5 1.5-0.3 0.5 0.2 1 0 1.5 0.3"
          :stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Staff Icon (Person in Gown) -->
      <g v-else-if="name === 'staff'" class="hand-drawn-path">
        <!-- Person's head -->
        <circle
          cx="12"
          cy="7"
          r="2.5"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <!-- Gown/Robe body -->
        <path
          d="M6 21v-6c0-1 1-2 2-2h8c1 0 2 1 2 2v6"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Gown shoulders/collar -->
        <path
          d="M7 13c1-1 2-1.5 5-1.5s4 0.5 5 1.5"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Sleeves -->
        <path
          d="M7 13l-1 3 2 1M17 13l1 3-2 1"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
        <!-- Gown front opening/lapels -->
        <path
          d="M12 13v8"
          :stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>

      <!-- Default fallback (simple circle) -->
      <g v-else class="hand-drawn-path">
        <circle
          cx="12"
          cy="12"
          r="8"
          :stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          class="wobbly-line"
        />
        <path
          d="M8 12h8M12 8v8"
          :stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          class="wobbly-line"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  color: {
    type: String,
    default: 'current'
  },
  customColor: {
    type: String,
    default: null
  }
})

const sizeMap = {
  xs: { size: 16, class: 'w-4 h-4' },
  sm: { size: 20, class: 'w-5 h-5' },
  md: { size: 24, class: 'w-6 h-6' },
  lg: { size: 28, class: 'w-7 h-7' },
  xl: { size: 32, class: 'w-8 h-8' },
  '2xl': { size: 40, class: 'w-10 h-10' }
}

const colorMap = {
  current: 'text-current',
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  danger: 'text-red-500',
  white: 'text-white'
}

const actualSize = computed(() => sizeMap[props.size].size)
const viewBoxSize = computed(() => 24) // Standard viewBox
const sizeClass = computed(() => sizeMap[props.size].class)
const colorClass = computed(() => colorMap[props.color] || 'text-current')

const currentColor = computed(() => {
  if (props.customColor) return props.customColor
  return 'currentColor'
})

const customStyle = computed(() => {
  if (props.customColor) {
    return { color: props.customColor }
  }
  return {}
})
</script>

<style scoped>
.hand-drawn-icon {
  transition: all 0.2s ease;
}

.hand-drawn-icon:hover {
  transform: scale(1.05);
}

.hand-drawn-svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Hand-drawn wobbly effect */
.wobbly-line {
  animation: wobble 3s ease-in-out infinite;
  transform-origin: center;
}

.wobbly-dot {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes wobble {
  0%, 100% {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 0.5 0.5;
    stroke-dashoffset: 0.25;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Hand-drawn style stroke variations */
.wobbly-line {
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#roughPaper);
}

/* Add slight randomness to make it look hand-drawn */
.hand-drawn-path path:nth-child(odd) {
  animation-delay: 0.5s;
}

.hand-drawn-path path:nth-child(even) {
  animation-delay: 1s;
}
</style>