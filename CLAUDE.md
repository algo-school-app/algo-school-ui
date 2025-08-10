# AlgoSchool.app - Development Notes

## SaaS Architecture Overview

**AlgoSchool.app** is a multi-client SaaS platform where:
- **Each client** has their own dedicated Supabase instance
- **Within each client**, there can be multiple campuses/schools (multi-tenant)
- **First client**: MCGP School (Islamic weekend school with Saturday, Sunday, and Thursday programs)

## Multi-Level Architecture

```
AlgoSchool.app (SaaS Platform)
├── Client 1: MCGP School (Islamic School)
│   ├── Tenant: Saturday School Program
│   ├── Tenant: Sunday School Program  
│   └── Tenant: Thursday School Program
├── Client 2: [Future Client]
│   ├── Tenant: [Campus/School 1]
│   └── Tenant: [Campus/School 2]
└── Client N: [Future Client]
    └── [Tenants...]
```

## Vue.js Import Strategy (CRITICAL)

### ⚠️ ALWAYS CHECK IMPORTS FIRST
Before writing any Vue component, ALWAYS start with the import line:

```javascript
// For components using ref, reactive, computed, onMounted, etc.
const { ref, reactive, computed, onMounted, watch } = Vue;

// Common patterns:
// - ref: for reactive primitives
// - reactive: for reactive objects
// - computed: for computed properties
// - onMounted: for lifecycle hooks
// - watch: for watchers
```

### 🔍 Import Checklist for Every Component File

1. **Before writing any component** - Add Vue destructuring import
2. **Check existing files** - Look at what imports they use
3. **Add all needed imports** - Don't add one at a time
4. **Test immediately** - Check console for errors after adding imports

### 📋 Standard Import Templates

#### Basic Component Template:
```javascript
const { ref, reactive, computed, onMounted } = Vue;

const ComponentName = {
    template: `...`,
    props: {...},
    setup(props, { emit }) {
        // Component logic
        return { ... };
    }
};

window.ComponentName = ComponentName;
```

#### Component with Common Imports:
```javascript
const { ref, reactive, computed, onMounted, watch, nextTick } = Vue;
```

### 🚨 Common Mistakes to Avoid

1. **Never start writing Vue logic without imports**
2. **Don't assume imports exist** - always check the file
3. **Don't add imports one by one** - think ahead about what you need
4. **Always export component to window** - `window.ComponentName = ComponentName`

### 🛠️ Testing Strategy

After any component changes:
1. Check browser console for errors
2. Test all Vue reactivity features
3. Verify component registration works
4. Test on both desktop and mobile

### 📁 File Structure Rules

- All Vue components in `js/components/`
- All imports at the top of each file
- Consistent naming: `ComponentName.js`
- Always export to window object

### 🎯 Prevention Checklist

Before editing any `.js` file:
- [ ] Check if it's a Vue component
- [ ] Look at the first line - are Vue imports present?
- [ ] Add missing imports before writing Vue code
- [ ] Test immediately after changes

## Vue CDN Setup

Current setup uses:
- Vue 3 from CDN: `https://unpkg.com/vue@3/dist/vue.global.js`
- Composition API (not Options API)
- CDN-based approach (no build process)

## Mobile Navigation Architecture

The mobile navigation works through:
1. `sidebarMobileOpen` state in main app
2. Mobile header with hamburger button
3. CSS classes: `.show` for mobile sidebar visibility
4. Overlay for closing sidebar on outside tap

## Client-Specific Configuration

### MCGP School (First Client)
- **Type**: Islamic Weekend School
- **Programs**: Saturday, Sunday, Thursday
- **Tenant Names**: "Saturday School", "Sunday School", "Thursday School"
- **Supabase**: Dedicated instance for MCGP School only

### Future Client Onboarding
- Each new client gets their own Supabase instance
- Tenant structure customizable per client
- Branding and theming configurable per client

## Development Workflow

1. **Always read existing files first** before making changes
2. **Check Vue imports** at the start of every component file
3. **Test on mobile** after any navigation changes
4. **Use browser dev tools** to verify reactivity works
5. **Remember the multi-level architecture** when making changes:
   - Changes affect all clients (SaaS level)
   - Changes affect specific client (Supabase level)
   - Changes affect tenant-specific features (within client)