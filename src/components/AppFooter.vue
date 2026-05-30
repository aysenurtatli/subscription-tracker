<script setup lang="ts">

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-12 pt-6 pb-2 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">

    <div>
      &copy; {{ currentYear }} Prune. {{ $t('footer.rights') }}
    </div>

    <div class="flex items-center gap-4">
      <a href="#" class="hover:text-main transition-colors" title="GitHub">
        <i class="pi pi-github text-lg"></i>
      </a>
      <a href="#" class="hover:text-main transition-colors" title="Twitter / X">
        <i class="pi pi-twitter text-lg"></i>
      </a>
      <a href="#" class="hover:text-main transition-colors" title="Website">
        <i class="pi pi-globe text-lg"></i>
      </a>
    </div>

  </footer>
</template>
